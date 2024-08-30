import {Component} from '@angular/core'
import {StandardDataService, Metadata} from '../../services/standard-data.service'
import {TemplateConfigService} from '../../services/template-config.service'

@Component({
  selector: 'cover',
  templateUrl: './cover.slide.html',
  styleUrls: ['./cover.slide.less']
})
export class CoverSlide {
  loading = true
  metadata: Metadata
  templateConfigs: any

  constructor(dataService: StandardDataService, templateConfigService: TemplateConfigService) {
    dataService
      .metadata()
      .subscribe(metadata => {
        this.loading = false
        if (!metadata) return
        metadata.name = metadata.name && metadata.name.titleize()
        this.metadata = metadata
      })

    templateConfigService.getTemplateConfigs().subscribe(templateConfigs => {
      this.templateConfigs = templateConfigs
    })
  }
}
