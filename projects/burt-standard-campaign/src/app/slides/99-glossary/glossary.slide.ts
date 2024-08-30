import { Component } from '@angular/core'

@Component({
  selector: 'glossary',
  templateUrl: './glossary.slide.html',
  styleUrls: ['./glossary.slide.less']

})
export class GlossarySlide {
  glossary = [
    {metric: 'Booked Impressions', definition: 'The total number of impressions booked in DFP.'},
    {metric: 'Served Impressions', definition: 'The total number of impressions served as recorded by DFP.'},
    {metric: '% Delivered', definition: 'The total number of impressions booked in DFP through the total number of impressions served as recorded by DFP.'},
    {metric: 'Clicks', definition: 'The total number of clicks served as recorded by DFP.'},
    {metric: 'CTR', definition: 'The percentage of clicks out of served impressions.'},
    {metric: 'Viewable Rate', definition: 'The amount of DFP Viewable Impressions through the amount of DFP Active view impressions.'},
  ]
}
