import { Component } from '@angular/core';
import { CmiDataService } from '../../services/cmi-data.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'display-performance',
  templateUrl: './display-performance.component.html',
  styleUrl: './display-performance.component.less'
})
export class DisplayPerformanceComponent {
  boxOne: string = "#8083A6";
  boxTwo: string = "#7CD1F6";
  boxThree: string = "#B6E1F3";
  boxFour: string = "#DAC3D7";
  loading: boolean
  totals
  constructor(dataService: CmiDataService) {
    combineLatest([
      dataService.displayPerformance(),
    ]).subscribe(([totals]) => {
        this.loading = false;
        this.totals = totals;
      });
  }
}
