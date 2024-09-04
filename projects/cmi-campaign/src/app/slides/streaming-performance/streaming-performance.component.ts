import { Component } from '@angular/core';
import { CmiDataService } from '../../services/cmi-data.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'streaming-performance',
  templateUrl: './streaming-performance.component.html',
  styleUrl: './streaming-performance.component.less'
})
export class StreamingPerformanceComponent {
  boxOne: string = "#8083A6";
  boxTwo: string = "#7CD1F6";
  boxThree: string = "#B6E1F3";
  boxFour: string = "#DAC3D7";
  loading: boolean
  totals
  constructor(dataService: CmiDataService) {
    combineLatest([
      dataService.streamingPerformance(),
    ]).subscribe(([totals]) => {
        this.loading = false;
        this.totals = totals;
      });
  }
}
