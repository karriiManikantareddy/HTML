import { Component ,ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-social-media-creative-summary',
  templateUrl: './social-media-creative-summary.component.html',
  styleUrl: './social-media-creative-summary.component.css'
})
export class SocialMediaCreativeSummaryComponent {
  title:string='Creative Screenshot'
  headers = ['Display Creative', 'Impressions','Clicks','CTR'];
  data = [
    {
      "Display Creative": "Creative 1",
      "Impressions": "nkfjn",
      "Clicks": "fnf",
      "CTR": "fndnfmd",
    },
    {
      "Display Creative": "Creative 1",
      "Impressions": "nkfjn",
      "Clicks": "fnf",
      "CTR": "fndnfmd",
    },
    {
      "Display Creative": "Creative 1",
      "Impressions": "nkfjn",
      "Clicks": "fnf",
      "CTR": "fndnfmd",
    },
    {
      "Display Creative": "Creative 1",
      "Impressions": "nkfjn",
      "Clicks": "fnf",
      "CTR": "fndnfmd",
    },
    {
      "Display Creative": "Creative 1",
      "Impressions": "nkfjn",
      "Clicks": "fnf",
      "CTR": "fndnfmd",
    }, {
      "Display Creative": "Creative 1",
      "Impressions": "nkfjn",
      "Clicks": "fnf",
      "CTR": "fndnfmd",
    }
  ];
}
