import { Component } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {
headerImg: string = 'assets/img/header.png'
headerTitle:string='Proof of Performance'
headerSubTitle:string = 'Date Range'
campaignName:string = 'Campaign Name'
subTitle : string = 'Performance <br />& Insights '
bodyImg : string='assets/img/body.png'
logo :string= "assets/img/cox-logo.png"
}
