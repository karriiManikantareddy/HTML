import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core'
import * as $ from 'jquery'
import { Variables } from '../../variables'

@Component({
  selector: 'top-creative-preview',
  templateUrl: './top-creative-preview.component.html',
  styleUrls: ['./top-creative-preview.component.less']
})
export class TopCreativePreview implements OnInit {
  @Input() creative: any;
  @ViewChild('iframe', { static: true }) iframe: ElementRef;
  @ViewChild('iframeWrap', { static: true }) iframeWrap: ElementRef;
  private maxWidth: number = 520;
  private maxHeight: number = 250;
  private paddingBottom: number = 30;
  private el: ElementRef;

  constructor(
    el: ElementRef,
    variables: Variables,
  ) {
    this.el = el;
    const colors = variables.colors;
  }

  ngOnInit() {
    const w = this.creative.width;
    const h = this.creative.height;
    const pb = this.paddingBottom;
    const containers = this.el.nativeElement.closest('section').querySelectorAll('.wrap-img');
    let maxH = 0;

    if (w > this.maxWidth || h > this.maxHeight) {
      const widthFactor = this.maxWidth / w;
      const heightFactor = this.maxHeight / h;
      const factor = Math.min(widthFactor, heightFactor);

      $(this.iframeWrap.nativeElement).height(`${factor * h + pb}px`);

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
      });
    }

    setTimeout(() => {
      containers.forEach(element => {
        const h = $(element).height();
        if (h > maxH) {
          maxH = h;
        } else {
          $(element).height(maxH);
        }
      })
    });
  }
}
