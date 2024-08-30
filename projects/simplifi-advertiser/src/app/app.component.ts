import { Component } from '@angular/core';
import {SimplifiDataService} from './services/simplifi-data.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  hasYoutube: boolean = true
  hasGoogleSearch: boolean = true
  hasFacebook: boolean = true
  hasSimplifi: boolean = true
  hasSimplifiNative: boolean = true;

  constructor(private dataService: SimplifiDataService) {}

  ngOnInit() {
    this.dataService.hasYoutube().subscribe(hasYoutube => this.hasYoutube = hasYoutube)
    this.dataService.hasGoogleSearch().subscribe(hasGoogleSearch => this.hasGoogleSearch = hasGoogleSearch)
    this.dataService.hasFacebook().subscribe(hasFacebook => this.hasFacebook = hasFacebook)
    this.dataService.hasSimplifi().subscribe(hasSimplifi => this.hasSimplifi = hasSimplifi)
    this.dataService.hasSimplifiNative().subscribe(hasSimplifiNative => this.hasSimplifiNative = hasSimplifiNative);
  }
}
