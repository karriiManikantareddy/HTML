import { Component } from '@angular/core'

@Component({
  selector: 'glossary',
  templateUrl: './glossary.slide.html',
  styleUrls: ['./glossary.slide.less']

})
export class GlossarySlide {
  glossary = [
    {metric: 'Booked Impressions', definition: 'The total number of impressions booked in the ad server.'},
    {metric: 'Delivered Impressions', definition: 'The total number of impressions served as recorded by the ad server.'},
    {metric: '% Delivered', definition: 'The total number of impressions booked in the ad server through the total number of impressions served as recorded by the ad server.'},
    {metric: 'Clicks', definition: 'The total number of clicks served as recorded by the ad server.'},
    {metric: 'CTR', definition: 'The percentage of clicks out of delivered impressions.'},
  ]
}
