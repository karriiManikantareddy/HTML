import {Component, Input} from '@angular/core'

@Component({
  selector: 'top-creative-info',
  templateUrl: './top-creative-info.component.html',
  styleUrls: ['./top-creative-info.component.less']
})
export class TopCreativeInfo {
  @Input() creative: any;
}
