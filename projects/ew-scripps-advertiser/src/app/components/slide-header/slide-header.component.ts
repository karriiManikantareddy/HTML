import { Component, Input } from '@angular/core'
import {EwScrippsDataService} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'slide-header',
  templateUrl: './slide-header.component.html',
  styleUrls: ['./slide-header.component.less']
})
export class SlideHeaderComponent {
  @Input() loading: boolean = true
  @Input() text: string
  logo: string = 'assets/img/logo.png'

  constructor(private dataService: EwScrippsDataService) {}

  ngOnInit() {
    this.dataService.metadata().subscribe(metadata => {
      if (metadata && metadata.station) {
        this.logo = 'assets/img/stations/' + metadata.station + '.png'
      }
    })
  }
}
