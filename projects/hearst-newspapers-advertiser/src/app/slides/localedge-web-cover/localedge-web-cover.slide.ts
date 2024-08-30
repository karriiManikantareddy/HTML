import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, Metadata} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'localedge-web-cover',
  templateUrl: './localedge-web-cover.slide.html',
  styleUrls: ['./localedge-web-cover.slide.less']
})
export class LocalEdgeWebCoverSlide {
  loading = true
  hasLocalEdgeWeb: boolean
  metadata?: Metadata

  constructor(dataService: HearstNewspapersDataService) {
    combineLatest([
      dataService.metadata(),
      dataService.hasLocalEdgeWeb(),
    ]).subscribe(([metadata, hasLocalEdgeWeb]) => {
        this.loading = false
        this.hasLocalEdgeWeb = hasLocalEdgeWeb
        this.metadata = metadata
      })
  }
}
