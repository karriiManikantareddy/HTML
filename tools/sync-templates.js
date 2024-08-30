#!/usr/bin/env node

const { ArgumentParser } = require('argparse')
const AWS = require('aws-sdk')
const { spawn } = require('child_process')
const crypto = require('crypto')
const dirsum = require('dirsum')
const fs = require('fs')
const tar = require('tar')
const util = require('util')
const tempfile = require('tempy')

const copyFile = util.promisify(fs.copyFile)
const dirDigest = util.promisify(dirsum.digest)

const local_ng_hash = (template) =>
  dirDigest(`./dist/${template}/`, 'md5').then(res => res.hash)

const remote_ng_hash = (res) =>
  res.Metadata.nghash

const s3_opts = (template, options, additional) =>
  Object.assign(
    {
      Bucket: `burthub-uploads-${options.region}`,
      Key: `${options.environment}/hub-app-templates/templates/${template}.tar.gz`,
    },
    additional
  )

const ng_build = (template, options) =>
  new Promise((resolve, reject) =>
    spawn(
      './node_modules/.bin/ng',
      ['build', ...options.ng_options.split(' '), `--base-href=/templates/${template}/`, template],
      {stdio: 'inherit', shell: true}
    )
    .on('error', reject)
    .on('exit', code => code == 0 ? resolve() : reject(code))
  )

async function one_template(template, options) {
  console.log(`Compiling template ${template}`)
  const s3 = new AWS.S3({region: options.region})

  await ng_build(template, options)
  await copyFile(`./projects/${template}/config.yml`, `./dist/${template}/config.yml`)
  const [remote_hash, local_hash] = await Promise.all([
      s3.headObject(s3_opts(template, options)).promise()
        .then(remote_ng_hash)
        .catch(err => { if(err.statusCode != 403 && err.statusCode != 404) throw err }),
      local_ng_hash(template)
    ])

  if (remote_hash == local_hash) {
    return {success: true, template, local_hash, remote_hash}
  }

  const tar_file = tempfile.file()
  await tar.create({file: tar_file, gzip: true, cwd: `./dist/${template}`}, ['.'])
  await s3.putObject(s3_opts(template, options, {Metadata: {nghash: local_hash}, Body: fs.createReadStream(tar_file)})).promise()
  return s3_opts(template, options, {success: true, template, local_hash, remote_hash})
}

async function process_queue(queue, results) {
  while (queue.length) {
    const template = queue.pop();
    if (template) {
      const result = await one_template(template, options).catch(err => ({success: false, template, err}))
      results.push(result)
    }
  }
}


const build_templates = (options) => {
  const queue = options.templates.slice()
  const results = []
  const workers = [...Array(3)].map(() => process_queue(queue, results))
  return Promise.all(workers).then(
    () => {
      return Promise.resolve(results)
    },
    (err) => {
      return [{success: false, template: '', err}];
    }
  )
}

const print_reports = (reports) =>
  reports.forEach(report => {
    if(report.success) {
      if(report.local_hash == report.remote_hash) {
        console.log(`Template ${report.template} with hash ${report.local_hash} has not changed`)
      } else {
        console.log(`Template ${report.template} hash ${report.remote_hash} -> ${report.local_hash}; uploading s3://${report.Bucket}/${report.Key}`)
      }
    } else {
      console.error(`Template ${report.template} build failed with: ${report.err.stack}`)
    }
  })

const complete_options = (options) =>
  Object.assign(
    options,
    {ng_options: options.ng_options || ((options.environment == 'production') ? '--configuration production --no-progress' : (options.environment == 'accept' || options.environment == 'staging') ? '--configuration production --source-map --no-progress' : '--source-map --no-progress')}
  )

const parser = new ArgumentParser({
  addHelp: true,
  description: 'Upload changed templates to S3',
})
parser.addArgument('--environment', {help: 'I.e. development, staging or production', defaultValue: 'development'})
parser.addArgument('--region', {help: 'AWS region, defaults to us-east-1', defaultValue: 'us-east-1'})
parser.addArgument('--ng-options', {help: 'Additional options to pass to `ng build`'})
parser.addArgument('--template', {help: 'One or more template names to sync', dest: 'templates', action: 'append', required: true})

const options = complete_options(parser.parseArgs(process.argv.slice(2)))
console.log(options);
(async () => {
  const reports = await build_templates(options)
  print_reports(reports)
  if(reports.some(report => !report.success)) process.exit(1)
})()
