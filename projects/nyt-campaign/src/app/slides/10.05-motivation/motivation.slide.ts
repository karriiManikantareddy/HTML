import { Component, Input } from '@angular/core'
import { NytDataService } from '../../services/nyt-data.service'


@Component({
  selector: 'motivation',
  templateUrl: './motivation.slide.html',
  styleUrls: ['./motivation.slide.less'],
})
export class MotivationSlide {
  loading: boolean = false
  motivationBenchmark: {name: string, ctr: number, industryCTR: number | 'n/a', diff: number | 'n/a'}[]
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  constructor(dataService: NytDataService) {
    dataService.benchmarksFiltered()
    .subscribe(benchmarksFiltered => {
      this.loading = false
      let selectedBenchmark = benchmarksFiltered;

      if (!selectedBenchmark) return

      const topBenchmarkValues = selectedBenchmark.benchmark_motivation_ctr.sortBy('y', true).first(5)

      this.motivationBenchmark = topBenchmarkValues.map(benchmark => {
        const industryBenchmark = selectedBenchmark.benchmark_motivation_industry_ctr.find(b => b.name === benchmark.name)
        return {
          name: benchmark.name,
          ctr: benchmark.y,
          industryCTR: industryBenchmark ? industryBenchmark.y : 'n/a',
          diff: industryBenchmark ? this.calculateDifference(benchmark.y, industryBenchmark.y) : 'n/a',
        }
      })
    })
  }

  private calculateDifference(ctr: number, industry: number) {
    return (+ctr.toFixed(4) - +industry.toFixed(4)) / +industry.toFixed(4)
  }
}
