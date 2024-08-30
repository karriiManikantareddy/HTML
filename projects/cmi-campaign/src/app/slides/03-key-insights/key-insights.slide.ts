import { Component } from '@angular/core'

@Component({
  selector: 'key-insights',
  templateUrl: './key-insights.slide.html',
  styleUrls: ['./key-insights.slide.less']
})
export class KeyInsightsSlide {
  loading = false
  defaultContentText = `<p>1: [Key Point Here] </p><p>2: [Key Point Here] </p><p>3: [Key Point Here] </p><p>4: [Key Point Here]</p>`
}
