import { Component } from '@angular/core';
interface TableData {
  site: string;
  impressions: string;
}
interface imageData {
  index: number;
  imageURL: string;
}

@Component({
  selector: 'app-video-site-app',
  templateUrl: './video-site-app.component.html',
  styleUrl: './video-site-app.component.css'
})
export class VideoSiteAppComponent {


  headerContent: string = 'Video <span class="highlight">&nbsp;Site/App</span>';
  greyBox: boolean = true;
  greyBoxContent:string='Sites & Apps where your ad was seen:'
  violetBoxContent:string = 'Performance';

  // imageData:imageData[] = [
   
  //   {
  //     index: 0,
  //     imageURL: "../../../assets/img/mtv.png",
  //   },
  //   {
  //     index: 1,
  //     imageURL: "../../../assets/img/tnt.png",
  //   },
  //   {
  //     index: 2,
  //     imageURL: "../../../assets/img/a&e.png",
  //   },
  //   {
  //     index: 3,
  //     imageURL: "../../../assets/img/msnbc.png",
  //   },
  //   {
  //     index: 4,
  //     imageURL: "../../../assets/img/amazontwitch.png",
  //   },
  //   {
  //     index: 5,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   },
  //   {
  //     index: 6,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   },
  //   {
  //     index: 7,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   },
  //   {
  //     index: 8,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   },
  //   {
  //     index: 9,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   },
  //   {
  //     index: 10,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   },
  //   {
  //     index: 11,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   },
  //   {
  //     index: 12,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   },
  //   {
  //     index: 13,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   },
  //   {
  //     index: 14,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   }, {
  //     index: 15,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   },
  //   {
  //     index: 16,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   },
  //   {
  //     index: 17,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   },
  //   {
  //     index: 18,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   },
  //   {
  //     index: 19,
  //     imageURL: "assets/images/video-site-app/video-site-app-1.png",
  //   },

  // ]

  tableData :TableData[]= [
    { site: 'Site/App 1', impressions: '1000' },
    { site: 'Site/App 2', impressions: '850' },
    { site: 'Site/App 3', impressions: '85000' },
    { site: 'Site/App 4', impressions: '85000' },
    { site: 'Site/App 5', impressions: '1000' },
    { site: 'Site/App 6', impressions: '850' },
    { site: 'Site/App 7', impressions: '85000' },
    { site: 'Site/App 8', impressions: '85000' },
    { site: 'Site/App 9', impressions: '85000' },
    { site: 'Site/App 10', impressions: '85000' },
  ];


}
