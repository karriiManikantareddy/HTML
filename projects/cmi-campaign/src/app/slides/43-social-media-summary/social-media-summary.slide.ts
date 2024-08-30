import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { CmiDataService } from '../../services/cmi-data.service'

@Component({
  selector: 'social-media-summary',
  templateUrl: './social-media-summary.slide.html',
  styleUrls: ['./social-media-summary.slide.less']
})
export class SocialMediaSummarySlide {
  _comment = 0
  _post = 0
  _post_reaction = 0
  engagements: any = 0
  engagement_rate = 0
  facebook_share = 0
  instagram_share = 0
  totalShare = 0
  loading = true
  hasSocial = false

  constructor(dataService: CmiDataService) {
    combineLatest([
      dataService.socialTotal(),
      dataService.hasSocial(),
    ]).subscribe(([{
                    _post_reaction,
                    _comment,
                    _post,
                    engagements,
                    engagement_rate,
                    facebook_share,
                    instagram_share,
                    totalShare
                  }, hasSocial]) => {
      this.hasSocial = hasSocial
      if (hasSocial) {
        this.totalShare = totalShare
        this._post_reaction = _post_reaction
        this._comment = _comment
        this._post = _post
        this.engagements = engagements
        this.engagement_rate = engagement_rate
        this.facebook_share = facebook_share
        this.instagram_share = instagram_share
      }
      this.loading = false
      })
  }
}
