import {Component} from '@angular/core'

@Component({
  selector: 'data-definitons',
  templateUrl: './data-definitions.html',
  styleUrls: ['./data-definitions.less']
})

export class DataDefinitionsSlide {
  dataDefinitions: {data: string, definition: string, explanation?: string}[] = [
    {
      data: 'Visits to Site:',
      definition: 'Total number of unique visits to content microsite'
    },
    {
      data: 'Pageviews:',
      definition: 'Number of times pages were viewed within content microsite - Unique value'
    },
    {
      data: 'Content Engagement Rate:',
      definition: 'Actions taken on microsite indicating content engagement / Number of Unique Sessions',
      explanation: 'Actions include (clicks to content/articles, scroll depth)'
    },
    {
      data: 'Scroll Depth:',
      definition: 'Average Scroll Depth per session. Key points are 33%, 50%, 75% and 100%'
    },
    {
      data: 'Dwell Time:',
      definition: 'Average time spent on content per session'
    },
    {
      data: 'Brand Intent / Interest:',
      definition: 'Actions taken by audience indicating brand interest / Number of Unique Sessions',
      explanation: 'Actions include Click-outs to OEM and autoTRADER sites'
    },
    {
      data: 'Outbound Clicks:',
      definition: 'Click outs from content site to OEM and autoTRADER sites'
    },
  ]
}
