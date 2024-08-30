import {Component} from '@angular/core'
import { Metadata, RedVenturesDataService } from '../../services/red-ventures-data.service'

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent {
  metadata: Metadata
  today: Date

  constructor(private dataService: RedVenturesDataService) {
    this.today = new Date()
    dataService
      .metadata()
      .subscribe(metadata => {
        this.metadata = metadata
      })
  }
}
