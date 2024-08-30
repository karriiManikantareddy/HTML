import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core'
import {DisplayAd} from '../../services/the-advocate-data.service'
import * as $ from 'jquery'

@Component({
  selector: 'gam-creative',
  templateUrl: './gam-creative.component.html',
  styleUrls: ['./gam-creative.component.less']
})
export class GamCreativeComponent implements OnInit {
  @Input() displayAd: DisplayAd
  @ViewChild('iframe', { static: true }) iframe: ElementRef
  @ViewChild('iframeWrap', { static: true }) iframeWrap: ElementRef
  private maxWidth = 400
  private maxHeight = 100
  private el: ElementRef

  constructor(
    el: ElementRef, 
  ) {
    this.el = el
  }

  ngOnInit() {
    const w = this.displayAd.width
    const h = this.displayAd.height
    const containers = this.el.nativeElement.closest('section').querySelectorAll('.wrap-img');
    let maxH = 0;

    if (w > this.maxWidth || h > this.maxHeight) {
      let widthFactor = this.maxWidth / w
      let heightFactor = this.maxHeight / h
      const factor = Math.min(widthFactor, heightFactor)

      $(this.iframeWrap.nativeElement).height(`${h}px`)

      $(this.iframe.nativeElement).css({
        '-moz-transform':           `scale(${factor})`,
        '-moz-transform-origin':    '0 0',
        '-o-transform':             `scale(${factor})`,
        '-o-transform-origin':      '0 0',
        '-webkit-transform':        `scale(${factor})`,
        '-webkit-transform-origin': '0 0',
        '-ms-transform':            `scale(${factor})`,
        '-ms-transform-origin':     '0 0',
        'transform':                `scale(${factor})`,
        'transform-origin':         '0 0',
        'margin':                   '0',
      })
    }

    setTimeout(() => {
      containers.forEach(element => {
        const h = $(element).height();
        if (h > maxH) maxH = h
        else $(element).height(maxH)
      })
    })
  }
}
