import {Component, Input} from '@angular/core'
import {NytDataService, Metadata, Benchmark} from '../../services/nyt-data.service'
import { forkJoin } from 'rxjs';


@Component({
  selector: 'benchmarks-cover',
  templateUrl: './benchmarks-cover.slide.html',
  styleUrls: ['./benchmarks-cover.slide.less']
})

export class BenchmarksCoverSlide {
  loading = true
  metadata?: Metadata
  benchmarks?: Benchmark[] = []
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  constructor(dataService: NytDataService) {
    forkJoin([
      dataService.metadata(),
      dataService.benchmarks()
    ])
    .subscribe(([metadata, benchmarks]) => {
      this.loading = false
      this.metadata = metadata
      this.benchmarks = benchmarks
    })
  }
}
