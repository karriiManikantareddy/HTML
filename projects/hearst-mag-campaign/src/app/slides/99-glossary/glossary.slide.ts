import { Component } from '@angular/core'

@Component({
  selector: 'glossary',
  templateUrl: './glossary.slide.html',
  styleUrls: ['./glossary.slide.less']

})
export class GlossarySlide {
  glossary = [
    {metric: 'First Party Impressions', definition: 'The total number of impressions served as recorded by DFP.'},
    {metric: 'Third Party Impressions', definition: 'The total number of impressions served as recorded by DCM'},
    {metric: 'First Party Clicks', definition: 'The total number of clicks served as recorded by DFP.'},
    {metric: 'Third Party Clicks', definition: 'The total number of clicks served as recorded by DCM.'},
    {metric: 'First Party CTR', definition: 'The percentage of clicks out of served impressions.'},
  ]
}
