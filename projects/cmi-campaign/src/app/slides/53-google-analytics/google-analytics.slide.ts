import { Component } from '@angular/core'

@Component({
  selector: 'google-analytics',
  templateUrl: './google-analytics.slide.html',
  styleUrls: ['./google-analytics.slide.less']
})
export class GoogleAnalyticsSlide {
  loading = false
  defaultContentText = `<p>1: [Text Here] </p><p>2: [Text Here] </p><p>3: [Text Here] </p><p>4: [Text Here]</p>`
}
