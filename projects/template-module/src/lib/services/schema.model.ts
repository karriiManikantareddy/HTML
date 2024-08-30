export class DimensionProperty {
  constructor(readonly name: string, readonly meta: any = null) {}

  get displayName() {
    return Object.get(this.meta, 'display.name') || this.name.replace(/_/g, ' ').titleize()
  }

  clone(): DimensionProperty {
    return new DimensionProperty(this.name, JSON.parse(JSON.stringify(this.meta)))
  }
}

export class Dimension {
  constructor(
    readonly name: string,
    readonly meta?: any,
    readonly properties: DimensionProperty[] = [],
    readonly isSearchable: boolean = false
  ) {}

  get displayName() {
    return Object.get(this.meta, 'display.name') || this.name.replace(/_/g, ' ').titleize()
  }

  get isRequired() {
    return Object.get(this.meta, 'required') || false
  }

  get isSortable() {
    return false
  }

  clone(): Dimension {
    const properties = this.properties ? this.properties.map(property => property.clone()) : []
    return new Dimension(this.name, JSON.parse(JSON.stringify(this.meta)), properties, this.isSearchable)
  }
}

export class Metric {
  constructor(readonly name: string, readonly meta?: any) {}

  get displayName() {
    return Object.get(this.meta, 'display.name') || this.name.replace(/_/g, ' ').titleize()
  }

  get format(): {format: string, currency?: string} {
    const format = Object.get(this.meta, 'display.format') || 'number'
    return Object.isString(format) ? {format} : <any> format
  }

  get isSortable() {
    return Object.get(this.meta, 'order.enabled')
  }
}

class MetricSet {
  constructor(readonly name: string, readonly metrics: Metric[]) {}
}

export class Rollup {
  readonly name: string
  constructor(readonly value: string) {
    this.name = value.titleize()
  }

  equals(rollup: Rollup) {
    return this.value === rollup.value
  }
}

class Cube {
  private _dimensions = new Map<string, Dimension>()
  private _metrics = new Map<string, Metric>()

  constructor(dimensions: Dimension[], metrics: Metric[], public readonly rollups: Rollup[]) {
    for (const dimension of dimensions) {
      this._dimensions.set(dimension.name, dimension)
    }
    for (const metric of metrics) {
      this._metrics.set(metric.name, metric)
    }
  }

  get name() {
    return this.dimensions.map('name').sort().join(',')
  }

  get dimensions(): Dimension[] {
    return Array.from(this._dimensions.values())
  }

  get metrics(): Metric[] {
    return Array.from(this._metrics.values())
  }

  hasDimension(dimensionName: string) {
    return this._dimensions.has(dimensionName)
  }

  hasDimensions(dimensionNames: string[]) {
    return dimensionNames.every(name => this.hasDimension(name))
  }
}

class Fact {
  private _dimensions = new Map<string, Dimension>()
  private _metrics = new Map<string, Metric>()

  constructor(public readonly name: string, dimensions: Dimension[], metrics: Metric[], public readonly rollups: Rollup[]) {
    for (const dimension of dimensions) {
      this._dimensions.set(dimension.name, dimension)
    }
    for (const metric of metrics) {
      this._metrics.set(metric.name, metric)
    }
  }

  get dimensions(): Dimension[] {
    return Array.from(this._dimensions.values())
  }

  get metrics(): Metric[] {
    return Array.from(this._metrics.values())
  }

  hasMetric(metricName: string) {
    return this._metrics.has(metricName)
  }

  hasMetrics(metricNames: string[]) {
    return metricNames.every(name => this.hasMetric(name))
  }

  hasDimension(dimensionName: string) {
    return this._dimensions.has(dimensionName)
  }

  hasDimensions(dimensionNames: string[]) {
    return dimensionNames.every(name => this.hasDimension(name))
  }
}

export class Schema {
  private _meta: any
  private _dimensions = new Map<string, Dimension>()
  private _metricSets = new Map<string, MetricSet>()
  private _metrics = new Map<string, Metric>()
  private _cubes = new Map<string, Cube>()
  private _facts = new Map<string, Fact>()
  private _rollups = new Map<string, Rollup>()

  constructor(rawSchema: any) {
    this._meta = rawSchema['meta']
    this.parseSchema(rawSchema)
  }

  get displayName(): string {
    return Object.get(this._meta, 'display.name')
  }

  get dimensions(): Dimension[] {
    return Array.from(this._dimensions.values()).sortBy(dimension => dimension.displayName)
  }

  get metrics(): Metric[] {
    return Array.from(this._metrics.values()).sortBy(metric => metric.displayName)
  }

  get rollups(): Rollup[] {
    return Array.from(this._rollups.values())
  }

  fetchDimension(dimensionName: string): Dimension {
    const dimension = this._dimensions.get(dimensionName)
    if (dimension) {
      return dimension
    } else {
      throw new Error(`Unknown dimension ${dimensionName}`)
    }
  }

  fetchMetric(metricName: string): Metric {
    const metric = this._metrics.get(metricName)
    if (metric) {
      return metric
    } else {
      throw new Error(`Unknown metric ${metricName}`)
    }
  }

  isCubeBased() {
    return this._cubes.size > 0
  }

  isFactBased() {
    return this._facts.size > 0
  }

  hasCube(dimensions: Dimension[]) {
    const dimensionNames = <string[]> dimensions.map('name')
    if (dimensions.length !== dimensionNames.unique().length) {
      return false
    }

    if (this.isCubeBased()) {
      const cube = ['entity', ...dimensionNames].sort().unique().join(',')
      return this._cubes.has(cube)
    } else {
      return this.compatibleFacts(dimensionNames).length > 0
    }
  }

  requiredDimensions(): Dimension[] {
    return this.dimensions.filter(dimension => dimension.isRequired)
  }

  compatibleDimensions(dimensions: Dimension[]): Dimension[] {
    const dimensionNames = <string[]> dimensions.map('name')
    const compatibleDimensions = new Map<string, Dimension>()
    if (this.isCubeBased()) {
      for (const cube of this.compatibleCubes(dimensionNames)) {
        for (const dimension of cube.dimensions) {
          compatibleDimensions.set(dimension.name, dimension)
        }
      }
    } else {
      for (const fact of this.compatibleFacts(dimensionNames)) {
        for (const dimension of fact.dimensions) {
          compatibleDimensions.set(dimension.name, dimension)
        }
      }
    }
    return Array.from(compatibleDimensions.values())
  }

  compatibleMetrics(dimensions: Dimension[], metrics: Metric[]): Metric[] {
    const dimensionNames = <string[]> dimensions.map('name')
    const metricNames = <string[]> metrics.map('name')
    if (this.isCubeBased()) {
      const name = ['entity', ...dimensionNames].sort().unique().join(',')
      const cube = this._cubes.get(name)
      return cube ? cube.metrics : []
    } else {
      const compatibleMetrics = new Map<string, Metric>()
      for (const fact of this.compatibleFacts(dimensionNames, metricNames)) {
        for (const metric of fact.metrics) {
          compatibleMetrics.set(metric.name, metric)
        }
      }
      return Array.from(compatibleMetrics.values())
    }
  }

  compatibleRollups(dimensions: Dimension[]): Rollup[] {
    const dimensionNames = <string[]> dimensions.map('name')
    const name = ['entity', ...dimensionNames].sort().unique().join(',')
    let rollups: Rollup[]
    if (this.isCubeBased()) {
      const cube = this._cubes.get(name)
      rollups = cube ? cube.rollups : []
    } else {
      const fact = this._facts.get(name)
      rollups = fact ? fact.rollups : []
    }
    return rollups
  }

  private compatibleCubes(dimensionNames: string[]): Cube[] {
    return Array.from(this._cubes.values())
      .filter(cube => cube.hasDimensions(dimensionNames))
  }

  private compatibleFacts(dimensionNames: string[], metricNames: string[] = []): Fact[] {
    return Array.from(this._facts.values())
      .filter(fact => fact.hasDimensions(dimensionNames) && fact.hasMetrics(metricNames))
  }

  private parseSchema(rawSchema: any) {
    for (const rawDimension of rawSchema['dimensions']) {
      const dimension = this.parseDimension(rawDimension)
      this._dimensions.set(dimension.name, dimension)
    }

    for (const rawMetricSet of rawSchema['metric_sets']) {
      const metricSet = this.parseMetricSet(rawMetricSet)
      this._metricSets.set(metricSet.name, metricSet)
      for (const metric of metricSet.metrics) {
        this._metrics.set(metric.name, metric)
      }
    }

    for (const rawCube of (rawSchema['cubes'] || [])) {
      const cube = this.parseCube(rawCube)
      this._cubes.set(cube.name, cube)

      for (const rollup of cube.rollups) {
        this._rollups.set(rollup.name, rollup)
      }
    }

    for (const rawFact of (rawSchema['facts'] || [])) {
      const fact = this.parseFact(rawFact)
      this._facts.set(fact.name, fact)

      for (const rollup of fact.rollups) {
        this._rollups.set(rollup.name, rollup)
      }
    }
  }

  private parseDimension(rawDimension: any) {
    const dimensionName = rawDimension['name']
    const properties = (rawDimension['properties'] || [])
      .map((rp: any) => new DimensionProperty(rp['property'], rp['meta']))
    const filteredProperties = properties.filter((dp: any) => dp.name != dimensionName)
    const isSearchable = !!properties.find((dp: any) => Object.get(dp, 'meta.search'))
    return new Dimension(dimensionName, rawDimension['meta'], filteredProperties, isSearchable)
  }

  private parseMetricSet(rawMetricSet: any) {
    const metrics = rawMetricSet['metrics'].map((rawMetric: any) => {
      return new Metric(rawMetric['name'], rawMetric['meta'])
    })

    return new MetricSet(rawMetricSet['name'], metrics)
  }

  private parseCube(rawCube: any) {
    const dimensions = rawCube['dimensions'].map((name: string) => this._dimensions.get(name))
    const metrics = rawCube['metric_sets']
      .map((name: string) => this._metricSets.get(name))
      .map('metrics')
      .flatten()
      .unique()
    const rollups = rawCube['rollups'].map((value: string) => new Rollup(value))

    return new Cube(dimensions, metrics, rollups)
  }

  private parseFact(rawFact: any) {
    const dimensions = rawFact['dimensions'].map((name: string) => this._dimensions.get(name))
    const metrics = rawFact['metric_sets']
      .map((name: string) => this._metricSets.get(name))
      .map('metrics')
      .flatten()
      .unique()
    const rollups = rawFact['rollups'].map((value: string) => new Rollup(value))

    return new Fact(rawFact['name'], dimensions, metrics, rollups)
  }
}
