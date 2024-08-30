import {Component} from '@angular/core'

@Component({
  selector: 'table-of-contents',
  templateUrl: './table-of-contents.slide.html',
  styleUrls: ['./table-of-contents.slide.less']
})
export class TableOfContentsSlide {
  isWhiteFooter: boolean = true

  constructor() {}
}