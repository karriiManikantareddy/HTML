import { Schema, Metric, Dimension, Rollup, DimensionProperty } from './schema.model'

export class SliceProperty {
  constructor(readonly name: string, readonly value: string, readonly meta: any = null) {}

  get format(): string | null {
    return Object.get(this.meta, 'display.format')
  }
}

export class Slice {
  constructor(
    readonly dimension: Dimension,
    private readonly _value: string,
    readonly data: any,
  ) {}

  get id(): string {
    return this._value
  }

  get value(): string {
    const value = <string> Object.get(this.data, this.dimension.name) || this._value
    return value && value.length ? value : 'n/a'
  }

  clone(): Slice {
    return new Slice(this.dimension.clone(), this._value, JSON.parse(JSON.stringify(this.data)))
  }
}

export class Series {
  constructor(readonly slices: Slice[], readonly metrics: MetricValues[]) {}

  getData(dimensionName: string): any {
    const slice = this.slices.find(slice => slice.dimension.name === dimensionName)
    if (slice == null) {
      throw new Error(`Unable to find slice for ${dimensionName}`)
    }
    let data = slice.data
    if (data == null) {
      data = {}
      data[dimensionName] = slice.value
    }
    return data
  }
}

export class Row {
  shareOfs: Partial<Record<string, number>> = {}

  constructor(readonly date: Date, readonly slices: Slice[], public metrics: MetricValue[]) {}

  getData(dimensionName: string): any {
    const slice = this.slices.find(slice => slice.dimension.name === dimensionName)
    if (slice == null) {
      throw new Error(`Unable to find slice for ${dimensionName}`)
    }
    let data = slice.data
    if (data == null) {
      data = {}
      data[dimensionName] = slice.value
    }
    return data
  }

  calculateShareOfs(totals: Readonly<Partial<Record<string, number>>>): Readonly<Partial<Record<string, number>>> {
    this.shareOfs = {}
    this.metrics.forEach(m => {
      const total = totals[m.name]
      if (total) {
        this.shareOfs[m.name] = m.value / total
      }
    })
    return this.shareOfs
  }

  getSliceValue(dimensionName: string): string {
    const slice = this.slices.find(slice => slice.dimension.name == dimensionName)
    if (slice == null) {
      throw new Error(`Unable to find slice for ${dimensionName}`)
    }
    return slice.value
  }

  hasSlice(dimensionName: string): boolean {
    const slice = this.slices.find(slice => slice.dimension.name == dimensionName)
    return !!slice
  }

  getSliceId(dimensionName: string): string {
    const slice = this.slices.find(slice => slice.dimension.name == dimensionName)
    if (slice == null) {
      throw new Error(`Unable to find slice for ${dimensionName}`)
    }
    return slice.id
  }

  getMetricValue(name: string): number | null {
    const metricIndex = this.metrics.findIndex(metric => metric.name === name)
    if (metricIndex > -1) {
      return this.metrics[metricIndex].value
    }
    return null
  }
}

export class MetricCommon {
  readonly name: string
  readonly meta: object | null

  constructor(private metric: Metric) {
    this.name = metric.name
    this.meta = metric.meta
  }

  get displayName(): string {
    return this.meta && Object.get(this.meta, 'display.name') || this.name.titleize()
  }

  get format(): {format: string, currency?: string} {
    const format = Object.get(this.meta, 'display.format') || 'number'
    return Object.isString(format) ? {format} : <any> format
  }
}

export class MetricValues extends MetricCommon {
  constructor(metric: Metric, readonly values: number[]) {
    super(metric)
  }
}

export class MetricValue extends MetricCommon {
  constructor(metric: Metric, public value: number) {
    super(metric)
  }

  clone(): MetricValue {
    return <MetricValue> JSON.parse(JSON.stringify(this))
  }
}

export interface ChartSeries {
  readonly data: any[]
  readonly name?: string
  readonly format?: string
  readonly [k: string]: any
}

export class Result {
  readonly timestamps: number[] = []
  readonly dimensions: Dimension[] = []
  readonly metrics: Metric[] = []
  readonly rollup: Rollup = new Rollup('total')
  readonly series: Series[] = []
  readonly rows: Row[] = []
  readonly nextSlice: any = {}
  readonly limit?: number
  private _datasetName: string

  private _dimensionProperties = {}

  constructor(private schema: Schema, private rawQueryResult: any) {
    if (!rawQueryResult) return

    this.timestamps = rawQueryResult['timestamps'].map((ts: number) => ts * 1000)
    this.dimensions = this.parseDimensions(rawQueryResult['cube'])
    this.metrics = this.parseMetrics(rawQueryResult['metrics'])
    this.rollup = new Rollup(rawQueryResult['rollup'])
    this.limit = rawQueryResult['limit']
    this.nextSlice = rawQueryResult['next_slice']

    const rawSeries = rawQueryResult['series']
    this.series = this.parseSeries(rawSeries)
    this.rows = this.parseRows(rawSeries)
    this.calculateShareOfs(this.rows)
    this._datasetName = schema.displayName
  }

  get datasetName() {
    return this._datasetName
  }

  getSlices(dimensionName: string): Slice[] {
    const index = this.dimensions.findIndex(d => d.name === dimensionName)
    return this.rows.map(row => row.slices[index]).unique(s => s.value)
  }

  getChartSeries(mn: string | string[]): ChartSeries[] {
    if (!this.series) return []

    const mns = <string[]> [mn].flatten()
    return <any[]> this.series.map(ss => {
      return ss.metrics
        .filter(metric => mns.includes(metric.name))
        .map(metric => {
          const data = this.timestamps.map((t, i) => [t, metric.values[i]])
          return {
            name: metric.name,
            data: data,
            format: metric.format
          }
        })
    }).flatten()
  }

  private calculateShareOfs(rows: Row[]) {
    const totals: Partial<Record<string, number>> = {}
    const compatibleMetrics = this.metrics
      .filter(m => m.format.format === 'number')
      .reduce((memo, m) => {
        memo[m.name] = true
        return memo
      }, <Partial<Record<string, boolean>>> {})

    this.metrics.forEach((m, index) => {
      if (compatibleMetrics[m.name]) {
        totals[m.name] = rows.map(row => row.metrics[index].value).sum()
      }
    })
    rows.forEach(row => row.calculateShareOfs(totals))
  }

  private parseSeries(rawSeries: any[]) {
    return rawSeries.map(raw => {
      const slices = this.parseSlices(raw)
      const metrics = this.parseSeriesMetric(raw['metrics'])
      return new Series(slices, metrics)
    })
  }

  private parseRows(rawSeries: any[]): Row[] {
    return <any[]> rawSeries.map(raw => {
      const slices = this.parseSlices(raw)
      return this.timestamps.map((timestamp, index) => {
        const date = new Date(timestamp).setUTC(true)
        const metrics = this.parseRowMetrics(raw['metrics'], index)
        return new Row(date, slices, metrics)
      })
    }).flatten()
  }

  private parseDimensions(rawDimensions: string[]) {
    return rawDimensions.map(dimensionName => {
      const schemaDimension = this.schema.fetchDimension(dimensionName)

      const props: Partial<Record<string, any>> = {}
      for (const prop of schemaDimension.properties) {
        props[prop.name] = prop
      }

      let dimensionProperties: DimensionProperty[] = []
      return new Dimension(dimensionName, schemaDimension.meta, dimensionProperties)
    })
  }

  private parseSlices(rawRow: any) {
    const rawSlice = rawRow['slice']
    const rawData = rawRow['data'] || {}
    return this.dimensions.map(dimension => {
      const dimName = dimension.name
      const value = rawSlice[dimName]
      const data = rawData[dimName]
      return new Slice(dimension, value, data)
    })
  }

  private parseSeriesMetric(rawMetrics: any[]) {
    return rawMetrics.map(rawMetric => {
      const metric = this.schema.fetchMetric(rawMetric['name'])
      const values = rawMetric['values']
      return new MetricValues(metric, values)
    })
  }

  private parseRowMetrics(rawMetrics: any[], index: number) {
    return rawMetrics.map(rawMetric => {
      const metric = this.schema.fetchMetric(rawMetric['name'])
      const value = rawMetric['values'][index]
      return new MetricValue(metric, value)
    })
  }

  private parseMetrics(rawMetrics: string[]) {
    return rawMetrics.map(metricName => this.schema.fetchMetric(metricName))
  }

  isLimited() {
    return !!this.nextSlice
  }
}
