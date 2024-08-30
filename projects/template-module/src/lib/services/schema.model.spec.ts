import { TestBed } from '@angular/core/testing'

import {
  Schema,
  Dimension,
  Metric,
  Rollup
 } from './schema.model'

import {
  CUBE_BASED_SCHEMA,
  FACT_BASED_SCHEMA,
  MULTIPLE_FACT_BASED_SCHEMA
} from '../mocks/schemas.mock'

describe('Schema', () => {
  let schema

  it('can have metadata', () => {
    schema = new Schema(CUBE_BASED_SCHEMA)
    expect(schema.displayName).toEqual('My Schema')
  })

  describe('cube based', () => {
    beforeEach(() => {
      schema = new Schema(CUBE_BASED_SCHEMA)
    })

    it('has dimensions', () => {
      expect(schema.dimensions.length).toEqual(4)
    })

    describe('dimension', () => {
      it('has a name', () => {
        expect(schema.dimensions.map('name')).toEqual(['account', 'entity', 'environment', 'service'])
      })

      it('has a display name', () => {
        expect(schema.dimensions.map('meta.display.name')).toEqual(['Account', 'Entity', 'Environment', 'Service'])
      })

      it('is required or not', () => {
        expect(schema.dimensions.map(d => d.isRequired)).toEqual([false, false, true, false])
      })

      describe('#isSortable', () => {
        it('dimensions are NOT sortable', () => {
          expect(schema.fetchDimension('entity').isSortable).toBeFalsy()
        })
      })
    })

    it('has metrics', () => {
      expect(schema.metrics.length).toEqual(3)
    })

    describe('metric', () => {
      it('has a name', () => {
        expect(schema.metrics.map('name')).toEqual(jasmine.arrayContaining(['cost', 'impressions']))
      })

      it('has a display name', () => {
        expect(schema.metrics.map('meta.display.name')).toEqual(jasmine.arrayContaining(['Cost', 'Impressions']))
      })

      it('has a format', () => {
        expect(schema.metrics.map('meta.display.format')).toEqual(jasmine.arrayContaining(['currency', 'number']))
      })

      describe('#isSortable', () => {
        it('regular metrics are sortable', () => {
          expect(schema.fetchMetric('impressions').isSortable).toBeTruthy()
          expect(schema.fetchMetric('cost').isSortable).toBeTruthy()
        })

        it('calculated metrics are NOT sortable', () => {
          expect(schema.fetchMetric('calculated').isSortable).toBeFalsy()
        })
      })
    })

    describe('#isCubeBased', () => {
      it('returns true', () => {
        expect(schema.isCubeBased()).toBeTruthy()
      })
    })

    describe('#isFactBased', () => {
      it('returns false', () => {
        expect(schema.isFactBased()).toBeFalsy()
      })
    })

    describe('#hasCube', () => {
      it('returns true if the cube exists in the schema', () => {
        expect(schema.hasCube([new Dimension('entity'), new Dimension('service')])).toBeTruthy()
        expect(schema.hasCube([new Dimension('entity'), new Dimension('account')])).toBeFalsy()
        expect(schema.hasCube([new Dimension('entity'), new Dimension('entity')])).toBeFalsy()
      })

      it('adds entity if not already chosen since entity is always added in the backend to filter the repsonse by user access', () => {
        expect(schema.hasCube([new Dimension('service')])).toBeTruthy()
      })
    })

    describe('#compatibleDimensions', () => {
      it('defaults to all dimensions', () => {
        expect(schema.compatibleDimensions([]).map('name').sort()).toEqual(schema.dimensions.map('name').sort())
      })

      it('when one or more dimensions have been selected, it returns dimensions that when added would create valid cubes', () => {
        expect(schema.compatibleDimensions([]).map('name'))
          .toEqual(['entity', 'environment', 'service', 'account'])

        expect(schema.compatibleDimensions([new Dimension('environment')]).map('name'))
          .toEqual(['entity', 'environment', 'service'])
      })
    })

    describe('#compatibleMetrics', () => {
      it('returns the metrics for the matching cube', () => {
        expect(schema.compatibleMetrics([new Dimension('entity')], []).map('name')).toEqual(['cost', 'impressions'])
        expect(schema.compatibleMetrics([new Dimension('entity'), new Dimension('service')], []).map('name')).toEqual(['cost'])
      })

      it('adds entity if not already chosen since entity is always added in the backend to filter the repsonse by user access', () => {
        expect(schema.compatibleMetrics([new Dimension('service')], []).map('name')).toEqual(['cost'])
      })
    })

    describe('#fetchDimension', () => {
      it('fails if the dimension does not exist', () => {
        expect(() => schema.fetchDimension('NOPE')).toThrowError('Unknown dimension NOPE')
      })

      it('returns a dimension', () => {
        expect(Object.get(schema.fetchDimension('entity'), 'meta.display.name')).toEqual('Entity')
      })
    })

    describe('#fetchMetric', () => {
      it('fails if metric does not exist', () => {
        expect(() => schema.fetchMetric('NOPE')).toThrowError('Unknown metric NOPE')
      })

      it('returns a metric', () => {
        expect(Object.get(schema.fetchMetric('impressions'), 'meta.display.name')).toEqual('Impressions')
      })
    })

    describe('#rollups', () => {
      it('returns the available rollups from the schema', () => {
        expect(schema.rollups.map('value')).toContain('day')
      })

      it('includes total', () => {
        expect(schema.rollups.map('value')).toContain('total')
      })
    })

    describe('#compatibleRollups', () => {
      it('returns the list of rollups based on the selected dimensions', () => {
        expect(schema.compatibleRollups([new Dimension('entity')]).map('value')).toEqual(['total', 'day'])
      })

      it('adds entity if not already chosen since entity is always added in the backend to filter the repsonse by user access', () => {
        expect(schema.compatibleRollups([new Dimension('service')]).map('value')).toEqual(['total', 'day'])
      })
    })
  })

  describe('fact based', () => {
    beforeEach(() => {
      schema = new Schema(FACT_BASED_SCHEMA)
    })

    it('has dimensions', () => {
      expect(schema.dimensions.length).toEqual(5)
    })

    describe('dimension', () => {
      it('has a name', () => {
        expect(schema.dimensions.map('name')).toEqual(['city', 'country_name', 'organization', 'size', 'user_id'])
      })

      it('has a display name', () => {
        expect(schema.dimensions.map('meta.display.name')).toEqual(['City', 'Country', 'Organization', 'Size', 'User'])
      })
    })

    it('has metrics', () => {
      expect(schema.metrics.length).toEqual(2)
    })

    describe('metric', () => {
      it('has a name', () => {
        expect(schema.metrics.map('name')).toEqual(['active_duration', 'pageview_duration'])
      })

      it('has a display name', () => {
        expect(schema.metrics.map('meta.display.name')).toEqual(['Active Duration', 'Pageview Duration'])
      })

      it('has a format', () => {
        expect(schema.metrics.map('meta.display.format')).toEqual(['time', 'time'])
      })
    })

    describe('#isCubeBased', () => {
      it('returns false', () => {
        expect(schema.isCubeBased()).toBeFalsy()
      })
    })

    describe('#isFactBased', () => {
      it('returns true', () => {
        expect(schema.isFactBased()).toBeTruthy()
      })
    })

    describe('#hasCube', () => {
      it('returns true if the cube exists in the schema', () => {
        expect(schema.hasCube(schema.dimensions)).toBeTruthy()
        expect(schema.hasCube([new Dimension('country_name'), new Dimension('country_name')])).toBeFalsy()
      })
    })

    describe('#compatibleDimensions', () => {
      it('defaults to all dimensions', () => {
        expect(schema.compatibleDimensions([])).toEqual(schema.dimensions)
      })

      it('when one or more dimensions have been selected, it returns all possible valid dimensions', () => {
        const dimensions = [new Dimension('city'), new Dimension('user_id')]
        expect(schema.compatibleDimensions(dimensions).map('name'))
          .toEqual([ 'city', 'country_name', 'organization', 'size', 'user_id' ])
      })
    })

    describe('#compatibleMetrics', () => {
      it('returns the metrics for compatible facts', () => {
        expect(schema.compatibleMetrics([new Dimension('country_name')], []).map('name')).toEqual(['active_duration', 'pageview_duration'])
        expect(schema.compatibleMetrics(schema.dimensions, []).map('name')).toEqual(['active_duration', 'pageview_duration'])
      })
    })
  })

  describe('advanced fact based', () => {
    beforeEach(() => {
      schema = new Schema(MULTIPLE_FACT_BASED_SCHEMA)
    })

    describe('when selecting a dimension which is part of all facts', () => {
      it('all dimensions are available', () => {
        expect(schema.compatibleDimensions([new Dimension('search_destination_page')]).map('name')).toEqual([
          'entity', 'region', 'search_destination_page', 'user_gender', 'device_category', 'event_action'
        ])
      })

      it('all metrics are available', () => {
        expect(schema.compatibleMetrics([new Dimension('search_destination_page')], []).map('name')).toEqual([
          'pageviews', 'unique_pageviews', 'outbound_link_clicks', 'outbound_link_clicks_unique', 'total_events', 'unique_events'
        ])
      })

      describe('when selecting a metric which is not part of all facts', () => {
        it('only metrics part of the same fact as the selected metric are available', () => {
          expect(schema.compatibleMetrics([new Dimension('search_destination_page')], [new Metric('outbound_link_clicks')]).map('name')).toEqual([
            'outbound_link_clicks', 'outbound_link_clicks_unique'
          ])
        })
      })

      describe('when selecting another dimension which is not part of all facts', () => {
        it('limits the available dimensions', () => {
          expect(schema.compatibleDimensions([new Dimension('search_destination_page'), new Dimension('event_action')]).map('name')).toEqual([
            'entity', 'event_action', 'search_destination_page'
          ])
        })

        it('limits the available metrics', () => {
          expect(schema.compatibleMetrics([new Dimension('search_destination_page'), new Dimension('event_action')], []).map('name')).toEqual([
            'outbound_link_clicks', 'outbound_link_clicks_unique', 'total_events', 'unique_events'
          ])
        })
      })
    })
  })
})
