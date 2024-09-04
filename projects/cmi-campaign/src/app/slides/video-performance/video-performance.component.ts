import { Component } from '@angular/core';
import { CmiDataService } from '../../services/cmi-data.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'video-performance',
  templateUrl: './video-performance.component.html',
  styleUrl: './video-performance.component.less'
})
export class VideoPerformanceComponent {
  boxOne: string = "#8083A6";
  boxTwo: string = "#7CD1F6";
  boxThree: string = "#B6E1F3";
  boxFour: string = "#DAC3D7";
  loading: boolean
  totals
  constructor(dataService: CmiDataService) {
    combineLatest([
      dataService.videoPerformance(),
    ]).subscribe(([totals]) => {
        this.loading = false;
        this.totals = totals;
      });
  }
}
