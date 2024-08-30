import { Component } from '@angular/core';

@Component({
  selector: 'app-stearming-performance',
  templateUrl: './stearming-performance.component.html',
  styleUrl: './stearming-performance.component.css'
})
export class StearmingPerformanceComponent {
  headerContent: string = 'Streaming <span class="highlight">&nbsp;Performance</span>';
  boxOne: string = "#8083A6";
  boxTwo: string = "#7CD1F6";
  boxThree: string = "#B6E1F3";
  boxFour: string = "#DAC3D7";
  titleColor:string='#0F155B';
  subTitleColor:string='#0F155B';
}
