import {Component} from '@angular/core'
import {TemplateConfigService} from '../../services/template-config.service'


@Component({
  selector: 'header-logo',
  templateUrl: './header-logo.component.html',
  styles: [`
  .logo {
    position: absolute;
    right: 50px;
    max-height: 100px;
  }
`],
})
export class HeaderLogoComponent {
  templateConfigs: any

  constructor(templateConfigService: TemplateConfigService) {
    templateConfigService.getTemplateConfigs().subscribe(templateConfigs => {
      this.templateConfigs = templateConfigs
    })
  }
}
