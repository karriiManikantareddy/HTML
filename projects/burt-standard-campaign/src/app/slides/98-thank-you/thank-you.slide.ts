import { Component } from '@angular/core'
import {TemplateConfigService} from '../../services/template-config.service'

@Component({
  selector: 'thank-you',
  templateUrl: './thank-you.slide.html',
  styleUrls: ['./thank-you.slide.less']

})
export class ThankYouSlide {
  templateConfigs: any

  constructor(templateConfigService: TemplateConfigService) {
    templateConfigService.getTemplateConfigs().subscribe(templateConfigs => {
      this.templateConfigs = templateConfigs
    })
  }
}
