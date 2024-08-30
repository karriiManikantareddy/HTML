import { Component } from '@angular/core'

@Component({
  selector: 'recommendations',
  templateUrl: './recommendations.slide.html',
  styleUrls: ['./recommendations.slide.less']
})
export class RecommendationsSlide {
  loading = false
  defaultContentText = `<p>1: [Recommendation Here] </p><p>2: [Recommendation Here] </p><p>3: [Recommendation Here] </p><p>4: [Recommendation Here]</p>`
  defaultTextName = 'SC Name'
  defaultTextPhone = 'SC Phone'
  defaultTextEmail = 'SC Email'
}
