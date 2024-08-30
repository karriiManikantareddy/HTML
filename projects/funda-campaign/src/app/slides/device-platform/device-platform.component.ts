import { Component } from '@angular/core';
import { FundaDataService, Platform, Device } from '../../services/funda-data.service'
import { combineLatest, forkJoin } from 'rxjs';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'device-platform',
  templateUrl: './device-platform.component.html',
  styleUrls: ['./device-platform.component.less']
})
export class DevicePlatformComponent {
  legendColors = ['#f6a644', '#fee4c1', '#402d16', 'f5a742'];
  pieOptions = {
    colors: ['#f6a644', '#fee4c1', '#402d16', 'f5a742'],
    plotOptions: {
      pie: {
        showInLegend: true,
        dataLabels: {
          enabled: true,
          format: '<b>{point.percentage:.1f} %',
          distance: -50,
          style: { fontSize: '12px' },
          filter: {
            property: 'percentage',
            operator: '>',
            value: 0.1
          }
        },
      }
    }
  };
  domainlegendItems: any[];
  platformlegendItems: any[];
  loading = true;
  platforms: Platform[];
  chartPlatforms: Platform[] = [];
  shareOfPlatformTotal = {};
  shareOfDomainTotal = {};
  domains: Device[];
  platformDataList = [];
  domainDataList = [];
  pieDomainSeries = [];
  piePlatformSeries = [];
  chartType = 'pie';
  templateType: string = 'business';

  constructor(dataService: FundaDataService, settingsService: SettingsService
    ) {
    combineLatest([
      dataService.dfpDevice(),
      dataService.dfpPlatforms(),
      settingsService.settingData('template-type')
    ]).subscribe(([domains, platforms, templateType]) => {
      this.loading = false;
      this.templateType = templateType && templateType.data;
      if (platforms) {
        this.processPlatforms(platforms);
      }
      if (domains) {
        this.processDomains(domains);
      }
    });
  }
  private processDomains(domains: any[]) {
    if (!domains) {
      return;
    }
    const sum = domains.map('metrics.dfp_total_line_item_level_impressions').sum();
    for (const domain of domains) {
      const value: number = domain.metrics?.dfp_total_line_item_level_impressions || 0;
      this.shareOfDomainTotal[domain.name] = value / sum;
    }
    this.domains = domains.sortBy('metrics.dfp_total_line_item_level_impressions', true);
    this.domainDataList = this.domains.map(domain => ({
      name: domain.name,
      y: this.shareOfDomainTotal[domain.name]
    }));
    this.pieDomainSeries = [{
      data: this.domainDataList
    }];
    this.domainlegendItems = domains.map((domain, index) => ({
      name: domain.name,
      color: this.legendColors[index % this.legendColors.length]
    }));
  }

  private processPlatforms(platforms: any[]) {
    this.chartPlatforms = [];
    this.platformDataList = [];
    this.piePlatformSeries = [];
    this.platformlegendItems = [];

    const sum = platforms.map('metrics.dfp_total_line_item_level_impressions').sum();
    for (const platform of platforms) {
      const value: number = platform.metrics?.dfp_total_line_item_level_impressions || 0;
      if (value / sum >= 0.01) {
        const existingPlatform = this.chartPlatforms.find(p => p.name === platform.name);
        if (!existingPlatform) {
          this.chartPlatforms.push(platform);
          this.shareOfPlatformTotal[platform.name] = value / sum;
        }
      }
    }
    this.chartPlatforms = this.chartPlatforms.sortBy('metrics.dfp_total_line_item_level_impressions', true);
    this.platforms = platforms.sortBy('metrics.dfp_total_line_item_level_impressions', true);
    this.platformDataList = this.chartPlatforms.map(platform => ({
      name: platform.name,
      y: this.shareOfPlatformTotal[platform.name]
    }));
    this.piePlatformSeries = [{
      data: this.platformDataList
    }];
    this.platformlegendItems = this.chartPlatforms.map((platform, index) => ({
      name: platform.name,
      color: this.legendColors[index % this.legendColors.length]
    }));
  }
}
