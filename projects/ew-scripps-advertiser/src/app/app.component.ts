import { Component } from '@angular/core';
import {EwScrippsDataService} from './services/ew-scripps-data.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  hasCallrail: boolean = true
  hasGam: boolean = true
  hasGdn: boolean = true
  hasGoogleSearch: boolean = true
  hasGooglePerformanceMax: boolean = true
  hasGroundtruth: boolean = true
  hasFacebook: boolean = true
  hasMadhive: boolean = true
  hasSimplifi: boolean = true
  hasSiteImpact: boolean = true
  hasYoutube: boolean = true

  constructor(private dataService: EwScrippsDataService) {}

  ngOnInit() {
    this.dataService.hasCallrail().subscribe(hasCallrail => this.hasCallrail = hasCallrail)
    this.dataService.hasGam().subscribe(hasGam => this.hasGam = hasGam)
    this.dataService.hasGdn().subscribe(hasGdn => this.hasGdn = hasGdn)
    this.dataService.hasGoogleSearch().subscribe(hasGoogleSearch => this.hasGoogleSearch = hasGoogleSearch)
    this.dataService.hasGooglePerformanceMax().subscribe(hasGooglePerformanceMax => this.hasGooglePerformanceMax = hasGooglePerformanceMax)
    this.dataService.hasGroundtruth().subscribe(hasGroundtruth => this.hasGroundtruth = hasGroundtruth)
    this.dataService.hasFacebook().subscribe(hasFacebook => this.hasFacebook = hasFacebook)
    this.dataService.hasMadhive().subscribe(hasMadhive => this.hasMadhive = hasMadhive)
    this.dataService.hasSimplifi().subscribe(hasSimplifi => this.hasSimplifi = hasSimplifi)
    this.dataService.hasSiteImpact().subscribe(hasSiteImpact => this.hasSiteImpact = hasSiteImpact)
    this.dataService.hasYoutube().subscribe(hasYoutube => this.hasYoutube = hasYoutube)
  }

}
