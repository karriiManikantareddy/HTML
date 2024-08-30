import { Component } from '@angular/core'
import { AdevintaDataService, Metadata } from '../../services/adevinta-data.service'

@Component({
  selector: 'cover',
  templateUrl: './cover.slide.html',
  styleUrls: ['./cover.slide.less']
})
export class CoverSlide {
  dates = ''
  loading = true
  metadata: Metadata

  constructor(dataService: AdevintaDataService) {
    dataService
      .metadata()
      .subscribe(metadata => {
        this.loading = false
        if (!metadata) { return }
        metadata.name = metadata.name && metadata.name.titleize()
        this.metadata = metadata
        this.dates = this.getFormattedDates([metadata.startDate, metadata.endDate])
      })
  }

  getFormattedDates(dates: string[]): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
    return dates && dates.map((date) => new Date(`${date}T00:00:00`).toLocaleString('en-US', options)).join(' - ')
  }
}
