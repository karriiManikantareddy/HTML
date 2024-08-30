import { Component } from '@angular/core'

@Component({
  selector: 'glossary',
  templateUrl: './glossary.slide.html',
  styleUrls: ['./glossary.slide.less']

})
export class GlossarySlide {
  glossary = [
    {metric: 'Delivered Impressions', definition: 'The total number of impressions served as recorded by GAM.'},
    {metric: 'Clicks', definition: 'The total number of clicks served as recorded by GAM.'},
    {metric: 'CTR', definition: 'The percentage of clicks out of delivered impressions.'},
    {metric: 'Viewable Impressions', definition: 'The total number of viewable impression as recorded by GAM.'},
    {metric: 'Viewability', definition: 'The amount of GAM Viewable Impressions through the amount of GAM Active view impressions.'},
  ]
}
