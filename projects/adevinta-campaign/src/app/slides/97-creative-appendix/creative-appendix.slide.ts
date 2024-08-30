import { Component, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs';
import { AdevintaDataService, Creative } from '../../services/adevinta-data.service'

@Component({
  selector: 'creative-appendix',
  templateUrl: './creative-appendix.slide.html',
  styleUrls: ['./creative-appendix.slide.less']
})
export class CreativeAppendixSlide implements OnDestroy{
  loading = true
  creativeGroups: Creative[][];
  subscription: Subscription;

  constructor(dataService: AdevintaDataService) {
    this.subscription = dataService.creatives()
      .subscribe((creatives) => {
        this.loading = false
        if (!creatives || !creatives.length) { return }
        this.creativeGroups = creatives.inGroupsOf(4);
      })
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }  
}
