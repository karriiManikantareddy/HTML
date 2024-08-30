import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core'
import {Creative} from '../../services/funda-data.service'
import * as $ from 'jquery'

@Component({
  selector: 'creative-preview',
  templateUrl: './creative-preview.component.html',
  styleUrls: ['./creative-preview.component.less']
})
export class CreativePreviewComponent implements OnInit {
  @Input() creative: Creative
  @ViewChild('iframe', { static: true }) iframe: ElementRef
  @ViewChild('iframeWrap', { static: true }) iframeWrap: ElementRef
  private maxWidth = 520
  private maxHeight = 800
  private paddingBottom = 30
  private el: ElementRef

  constructor(el: ElementRef) {
    this.el = el
  }

  ngOnInit() {
    const w = this.creative.width
    const h = this.creative.height
    const pb = this.paddingBottom
    const containers = this.el.nativeElement.closest('section').querySelectorAll('.wrap-img');
    let maxH = 0;

    if (w > this.maxWidth || h > this.maxHeight) {
      let widthFactor = this.maxWidth / w
      let heightFactor = this.maxHeight / h
      const factor = Math.min(widthFactor, heightFactor)

      $(this.iframeWrap.nativeElement).height(`${factor * h + pb}px`)

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
