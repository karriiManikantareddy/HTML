import { Component } from '@angular/core';
import {TheAdvocateDataService} from './services/the-advocate-data.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  hasStreamingTv: boolean = true
  hasStreamingRadio: boolean = true
  hasYoutube: boolean = true
  hasOnsiteDisplay: boolean = true
  hasOnsiteVideo: boolean = true
  hasNewsletters: boolean = true
  hasGoogleSearch: boolean = true
  hasFacebook: boolean = true
  hasSiteImpact: boolean = true
  hasExtendedNetworkDisplay: boolean = true
  hasGoogleAnalytics: boolean = true
  hasBrandedContent: boolean = true;
  hasSemKeywords: boolean = true;
  hasAmazonVideo: boolean = true;
  hasAmazonDisplay: boolean = true;
  hasSocial: boolean= true;
  hasProgrammaticVideo: boolean= true;
  hasTikTok: boolean = true;
  hasGoogleAds: boolean = true;
  hasGeoFencing: boolean = true;
  hasLinkedIn: boolean = true;
  constructor(private dataService: TheAdvocateDataService) {}

  ngOnInit() {
    this.dataService.hasOnsiteDisplay().subscribe(hasOnsiteDisplay => this.hasOnsiteDisplay = hasOnsiteDisplay)
    this.dataService.hasOnsiteVideo().subscribe(hasOnsiteVideo => this.hasOnsiteVideo = hasOnsiteVideo)
    this.dataService.hasNewsletters().subscribe(hasNewsletters => this.hasNewsletters = hasNewsletters)
    this.dataService.hasExtendedNetworkDisplay().subscribe(hasExtendedNetworkDisplay => this.hasExtendedNetworkDisplay = hasExtendedNetworkDisplay)
    this.dataService.hasStreamingTv().subscribe(hasStreamingTv => this.hasStreamingTv = hasStreamingTv)
    this.dataService.hasStreamingRadio().subscribe(hasStreamingRadio => this.hasStreamingRadio = hasStreamingRadio)
    this.dataService.hasYoutube().subscribe(hasYoutube => this.hasYoutube = hasYoutube)
    this.dataService.hasGoogleSearch().subscribe(hasGoogleSearch => this.hasGoogleSearch = hasGoogleSearch)
    this.dataService.hasFacebook().subscribe(hasFacebook => this.hasFacebook = hasFacebook)
    this.dataService.hasSiteImpact().subscribe(hasSiteImpact => this.hasSiteImpact = hasSiteImpact)
    this.dataService.hasGoogleAnalytics().subscribe(hasGoogleAnalytics => this.hasGoogleAnalytics = hasGoogleAnalytics)
    this.dataService.hasBrandedContent().subscribe(hasBrandedContent => this.hasBrandedContent = hasBrandedContent);
    this.dataService.hasSemKeywords().subscribe(hasSemKeyword => this.hasSemKeywords = hasSemKeyword);
    this.dataService.hasAmazonVideo().subscribe(hasAmazonVideo => this.hasAmazonVideo = hasAmazonVideo);
    this.dataService.hasAmazonDisplay().subscribe(hasAmazonDisplay => this.hasAmazonDisplay = hasAmazonDisplay);
    this.dataService.hasSocial().subscribe(hasSocial => this.hasSocial = hasSocial);
    this.dataService.hasProgrammaticVideo().subscribe(hasProgrammaticVideo => this.hasProgrammaticVideo = hasProgrammaticVideo);
    this.dataService.hasTikTok().subscribe(hastiktok => this.hasTikTok = hastiktok);
    this.dataService.hasGoogleAds().subscribe(hasGoogleAds => this.hasGoogleAds = hasGoogleAds);
    this.dataService.hasGeoFencing().subscribe(hasGeoFencing => this.hasGeoFencing = hasGeoFencing);
    this.dataService.hasLinkedIn().subscribe(hasLinkedIn => this.hasLinkedIn = hasLinkedIn);
  }
}
