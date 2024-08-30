import { Component, Input } from '@angular/core'
import { NytDataService } from '../../services/nyt-data.service'


@Component({
  selector: 'emotion',
  templateUrl: './emotion.slide.html',
  styleUrls: ['./emotion.slide.less'],
})
export class EmotionSlide {
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  loading: boolean = false
  emotionBenchmark: {name: string, ctr: number, industryCTR: number | 'n/a', diff: number | 'n/a'}[]
  excludedEmotions = [
    'fear',
    'hate',
    'sadness',
    'not_curious',
    'not_disappointed',
    'not_stressed',
    'not_adventurous',
    'not_amused',
    'not_boredom',
    'not_competitive',
    'not_fear',
    'not_happiness',
    'not_hate',
    'not_hope',
    'not_indulgent',
    'not_informed',
    'not_inspired',
    'not_interest',
    'not_inthemoodtospend',
    'not_love',
    'not_nostalgic',
    'not_optimistic',
    'not_sadness',
    'not_selfconfident'
  ]

  constructor(dataService: NytDataService) {
    dataService.benchmarksFiltered()
    .subscribe(benchmarksFiltered => {
      this.loading = false
      let selectedBenchmark = benchmarksFiltered;

      if (!selectedBenchmark) return

      const topBenchmarkValues = selectedBenchmark.benchmark_emotion_ctr
        .filter((emotion) => !this.excludedEmotions.includes(emotion.name))
        .sortBy('y', true)
        .first(5)

      this.emotionBenchmark = topBenchmarkValues.map(benchmark => {
        const industryBenchmark = selectedBenchmark.benchmark_emotion_industry_ctr.find(b => b.name === benchmark.name)
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
