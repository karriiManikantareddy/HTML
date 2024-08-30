export const CUBE_BASED_SCHEMA = JSON.parse(`
  {
    "meta": {
      "display": {
        "name": "My Schema"
      }
    },
    "cubes": [
      {
        "dimensions": [
          "entity",
          "environment",
          "service"
        ],
        "index_rollup": "day",
        "metric_sets": [
          "default"
        ],
        "rollups": [
          "total",
          "day"
        ]
      },
      {
        "dimensions": [
          "entity",
          "account",
          "service"
        ],
        "index_rollup": "day",
        "metric_sets": [
          "default"
        ],
        "rollups": [
          "total",
          "day"
        ]
      },
      {
        "dimensions": [
          "entity",
          "environment"
        ],
        "index_rollup": "day",
        "metric_sets": [
          "default"
        ],
        "rollups": [
          "total",
          "day"
        ]
      },
      {
        "dimensions": [
          "entity",
          "service"
        ],
        "index_rollup": "day",
        "metric_sets": [
          "default"
        ],
        "rollups": [
          "total",
          "day"
        ]
      },
      {
        "dimensions": [
          "entity"
        ],
        "index_rollup": "day",
        "metric_sets": [
          "default",
          "impressions"
        ],
        "rollups": [
          "total",
          "day"
        ]
      }
    ],
    "dimensions": [
      {
        "name": "entity",
        "meta": {
          "display": {
            "name": "Entity"
          }
        },
        "properties": [
          {
            "property": "created",
            "meta": {
              "display": {
                "name": "Created",
                "format": "date"
              }
            }
          },
          {
            "property": "third_party_names.dcm",
            "meta": {
              "display": {
                "name": "DCM Name"
              }
            }
          }
        ]
      },
      {
        "name": "account",
        "meta": {
          "display": {
            "name": "Account"
          }
        }
      },
      {
        "name": "environment",
        "meta": {
          "required": true,
          "display": {
            "name": "Environment"
          }
        }
      },
      {
        "name": "service",
        "meta": {
          "display": {
            "name": "Service"
          }
        }
      }
    ],
    "metric_sets": [
      {
        "metrics": [
          {
            "name": "cost",
            "meta": {
              "display": {
                "name": "Cost",
                "format": "currency"
              },
              "order": {
                "enabled": true
              }
            }
          }
        ],
        "name": "default"
      },
      {
        "metrics": [
          {
            "name": "impressions",
            "meta": {
              "display": {
                "name": "Impressions",
                "format": "number"
              },
              "order": {
                "enabled": true
              }
            }
          }
        ],
        "name": "impressions"
      },
      {
        "metrics": [
          {
            "name": "calculated",
            "meta": {
              "dependencies": [
                "impressions",
                "cost"
              ],
              "display": {
                "name": "Calculated",
                "format": "percent"
              }
            }
          }
        ],
        "name": "calculated"
      }
    ]
  }
`)

export const FACT_BASED_SCHEMA = JSON.parse(`
  {
    "dimensions": [
      {
        "name": "city",
        "meta": {
          "display": {
            "name": "City"
          }
        }
      },
      {
        "name": "country_name",
        "meta": {
          "display": {
            "name": "Country"
          }
        }
      },
      {
        "name": "organization",
        "meta": {
          "display": {
            "name": "Organization"
          }
        }
      },
      {
        "name": "size",
        "meta": {
          "display": {
            "name": "Size"
          }
        }
      },
      {
        "name": "user_id",
        "meta": {
          "display": {
            "name": "User"
          }
        }
      }
    ],
    "facts": [
      {
        "dimensions": [
          "city",
          "country_name",
          "organization",
          "size",
          "user_id"
        ],
        "metric_sets": [
          "all"
        ],
        "name": "default",
        "rollups": [
          "second",
          "minute",
          "hour",
          "day",
          "week",
          "month",
          "year"
        ]
      }
    ],
    "metric_sets": [
      {
        "metrics": [
          {
            "name": "active_duration",
            "meta": {
              "display": {
                "name": "Active Duration",
                "format": "time"
              }
            }
          },
          {
            "name": "pageview_duration",
            "meta": {
              "display": {
                "name": "Pageview Duration",
                "format": "time"
              }
            }
          }
        ],
        "name": "all"
      }
    ]
  }
`)

export const MULTIPLE_FACT_BASED_SCHEMA = JSON.parse(`
  {
    "metric_sets": [
      {
        "name": "region_metrics",
        "metrics": [
          {
            "name": "pageviews",
            "meta": {
              "display": {
                "name": "Pageviews",
                "format": "number"
              }
            }
          },
          {
            "name": "unique_pageviews",
            "meta": {
              "display": {
                "name": "Unique Pageviews"
              }
            }
          }
        ]
      },
      {
        "name": "gender_metrics",
        "metrics": [
          {
            "name": "pageviews",
            "meta": {
              "display": {
                "name": "Pageviews",
                "format": "number"
              }
            }
          },
          {
            "name": "unique_pageviews",
            "meta": {
              "display": {
                "name": "Unique Pageviews"
              }
            }
          }
        ]
      },
      {
        "name": "device_metrics",
        "metrics": [
          {
            "name": "pageviews",
            "meta": {
              "display": {
                "name": "Pageviews",
                "format": "number"
              }
            }
          },
          {
            "name": "unique_pageviews",
            "meta": {
              "display": {
                "name": "Unique Pageviews"
              }
            }
          }
        ]
      },
      {
        "name": "outbound_link_clicks_metrics",
        "metrics": [
          {
            "name": "outbound_link_clicks",
            "meta": {
              "display": {
                "name": "Outbound Link Clicks"
              }
            }
          },
          {
            "name": "outbound_link_clicks_unique",
            "meta": {
              "display": {
                "name": "Outbound Link Clicks Unique"
              }
            }
          }
        ]
      },
      {
        "name": "scroll_tracking_metrics",
        "metrics": [
          {
            "name": "total_events",
            "meta": {
              "display": {
                "name": "Total Events"
              }
            }
          },
          {
            "name": "unique_events",
            "meta": {
              "display": {
                "name": "Unique Events"
              }
            }
          }
        ]
      }
    ],
    "dimensions": [
      {
        "name": "entity",
        "meta": {
          "display": {
            "name": "Property"
          }
        }
      },
      {
        "name": "search_destination_page",
        "meta": {
          "display": {
            "name": "Search Destination Page"
          }
        }
      },
      {
        "name": "region",
        "meta": {
          "display": {
            "name": "Region"
          }
        }
      },
      {
        "name": "user_gender",
        "meta": {
          "display": {
            "name": "User Gender"
          }
        }
      },
      {
        "name": "device_category",
        "meta": {
          "display": {
            "name": "Device Category"
          }
        }
      },
      {
        "name": "event_action",
        "meta": {
          "display": {
            "name": "Event Action"
          }
        }
      }
    ],
    "facts": [
      {
        "name": "region",
        "dimensions": [
          "entity",
          "region",
          "search_destination_page"
        ],
        "metric_sets": [
          "region_metrics"
        ],
        "rollups": [
          "day",
          "week",
          "month",
          "year",
          "total"
        ]
      },
      {
        "name": "gender",
        "dimensions": [
          "entity",
          "search_destination_page",
          "user_gender"
        ],
        "metric_sets": [
          "gender_metrics"
        ],
        "rollups": [
          "day",
          "week",
          "month",
          "year",
          "total"
        ]
      },
      {
        "name": "device",
        "dimensions": [
          "device_category",
          "entity",
          "search_destination_page"
        ],
        "metric_sets": [
          "device_metrics"
        ],
        "rollups": [
          "day",
          "week",
          "month",
          "year",
          "total"
        ]
      },
      {
        "name": "outbound_link_clicks",
        "dimensions": [
          "entity",
          "event_action",
          "search_destination_page"
        ],
        "metric_sets": [
          "outbound_link_clicks_metrics"
        ],
        "rollups": [
          "day",
          "week",
          "month",
          "year",
          "total"
        ]
      },
      {
        "name": "scroll_tracking",
        "dimensions": [
          "entity",
          "event_action",
          "search_destination_page"
        ],
        "metric_sets": [
          "scroll_tracking_metrics"
        ],
        "rollups": [
          "day",
          "week",
          "month",
          "year",
          "total"
        ]
      }
    ]
  }
`)
