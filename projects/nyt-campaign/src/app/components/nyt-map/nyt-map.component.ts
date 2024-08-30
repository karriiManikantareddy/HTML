import { Component, Input } from '@angular/core'
import { Country, Region } from '../../services/nyt-data.service'


@Component({
  selector: 'nyt-map',
  templateUrl: './nyt-map.component.html',
  styleUrls: ['./nyt-map.component.less']
})
export class NYTMapComponent {
  @Input() header: string
  @Input() topCountries?: Country[]
  @Input() topRegions?: Region[]
  @Input() mapSeries
  @Input() mapOptions
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  constructor() { }

}
