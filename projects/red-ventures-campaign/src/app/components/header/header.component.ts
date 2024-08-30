import {Component, Input} from '@angular/core'
import { Metadata, RedVenturesDataService } from '../../services/red-ventures-data.service'

@Component({
  selector: 'header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Input() text: string;
}
