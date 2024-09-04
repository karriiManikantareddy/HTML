import { Component, Input } from '@angular/core';

@Component({
  selector: 'text-banner',
  templateUrl: './text-banner.component.html',
  styleUrl: './text-banner.component.less'
})
export class TextBannerComponent {
  @Input() header: string = '';

}
