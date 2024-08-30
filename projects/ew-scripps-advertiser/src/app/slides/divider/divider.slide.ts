import {Component, Input} from '@angular/core'
import {EwScrippsDataService, Metadata} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'divider',
  templateUrl: './divider.slide.html',
  styleUrls: ['./divider.slide.less']
})
export class DividerSlide {
  @Input() name: string
  loading: boolean = false
  logo: string = 'assets/img/lighthouse.png'

  constructor(private dataService: EwScrippsDataService) {}

  ngOnInit() {
    this.dataService.metadata().subscribe(metadata => {
      if (metadata && metadata.station) {
        this.logo = 'assets/img/stations/' + metadata.station + '.png'
      }
    })
  }
}
