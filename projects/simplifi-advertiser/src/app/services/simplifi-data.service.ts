import {Injectable, Inject} from '@angular/core'
import {Observable} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { ChartSeries } from 'projects/template-module/src/lib/services/result.model';

export interface Dates {
  startDate?: string
  endDate?: string
}

export abstract class SimplifiDataService {
  abstract metadata(): Observable<Metadata | undefined>
  abstract totals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract totalsByDay(): Observable<any>
  abstract hasYoutube(): Observable<boolean>
  abstract youtubeTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract youtubeTotalsByDay(): Observable<any>
  abstract youtubeBreakdownItems(): Observable<Item[]>
  abstract youtubeCampaignBreakdownItems(): Observable<Item[]>
  abstract youtubeDevices(): Observable<Item[]>
  abstract youtubeKeywords(): Observable<Item[]>
  abstract hasGoogleSearch(): Observable<boolean>
  abstract googleSearchTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract googleSearchTotalsByDay(): Observable<any>
  abstract googleSearchBreakdownItems(): Observable<Item[]>
  abstract googleSearchCampaignBreakdownItems(): Observable<Item[]>
  abstract googleSearchDevices(): Observable<Item[]>
  abstract googleSearchKeywords(): Observable<Item[]>
  abstract hasFacebook(): Observable<boolean>
  abstract facebookTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract facebookTotalsByDay(): Observable<any>
  abstract facebookCampaignBreakdownItems(): Observable<Item[]>
  abstract facebookPlacementsBreakdowns(): Observable<Item[]>
  abstract facebookGenders(): Observable<Item[]>
  abstract facebookAges(): Observable<Item[]>
  abstract facebookBreakdownItems(): Observable<Item[]>
  abstract hasSimplifi(): Observable<boolean>
  abstract simplifiTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract simplifiTotalsLastPeriod(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract simplifiTotalsLastMonth(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract simplifiReachTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract simplifiVideoTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract simplifiTotalsByDay(): Observable<any>
  abstract simplifiBreakdownItems(): Observable<Item[]>
  abstract simplifiZipImpressionsBreakdownItems(dma: string): Observable<Item[]>
  abstract simplifiZipClicksBreakdownItems(dma: string): Observable<Item[]>
  abstract simplifiZipOnlineVisitsBreakdownItems(dma: string): Observable<Item[]>
  abstract simplifiZipTotalVisitsBreakdownItems(dma: string): Observable<Item[]>
  abstract simplifiAdZipImpressionsBreakdownItems(dma: string): Observable<Item[]>
  abstract simplifiAdZipClicksBreakdownItems(dma: string): Observable<Item[]>
  abstract simplifiAdZipOnlineVisitsBreakdownItems(dma: string): Observable<Item[]>
  abstract simplifiAdZipTotalVisitsBreakdownItems(dma: string): Observable<Item[]>
  abstract simplifiGeofencingBreakdownItems(): Observable<Item[]>
  abstract simplifiTargetGeofencingBreakdownItems(): Observable<Item[]>
  abstract simplifiCityBreakdownItems(): Observable<Item[]>
  abstract simplifiRegionBreakdownItems(): Observable<Region[]>
  abstract simplifiDisplayDomainBreakdownItems(): Observable<Item[]>
  abstract simplifiVideoDomainBreakdownItems(): Observable<Item[]>
  abstract simplifiAudienceBreakdownItems(): Observable<Item[]>
  abstract simplifiTacticBreakdownItems(): Observable<Item[]>
  abstract simplifiTopDma(): Observable<string>
  abstract simplifiKeywordsBreakdownItems(): Observable<Item[]>
  abstract simplifiDeviceBreakdownItems(): Observable<Item[]>
  abstract facebookDevices(): Observable<Item[]>;
  abstract facebookPlatforms(): Observable<Item[]>;
  abstract hasSimplifiNative(): Observable<boolean>;
  abstract simplifiNativeTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>;
  abstract simplifiNativeByDay(): Observable<any>;
  abstract simplifiNativeCampaignBreakdown(): Observable<Item[]>;
  abstract simplifiNativeCreativeBreakdown(): Observable<Item[]>;
  abstract facebookAdSet(): Observable<Item[]>;
  abstract facebookConversionByDay(): Observable<any>;
  abstract simplifiNativeDevice(): Observable<any>;
  abstract simplifiNativeDomain(): Observable<any>;
  abstract facebookDma(): Observable<any>;
  abstract simplifiAudioDomainBreakdownItems(): Observable<Item[]>;
  abstract simplifiTopDmaList();

  dates: Dates

  constructor(private window: any) {
    this.dates = this.datesFromInterval(location)
  }

  updateDates(startDate?: string, endDate?: string) {
    if (this.dates.startDate == null || startDate && startDate > this.dates.startDate) {
      this.dates.startDate = startDate
    }

    if (this.dates.endDate == null || endDate && endDate < this.dates.endDate) {
      this.dates.endDate = endDate
    }
  }

  private datesFromInterval(location: Location): Dates {
    const params = <any> Object.fromQueryString(location.search)
    const interval = params['interval']
    if (interval == null) {
      return {}
    } else {
      const parts = interval.toString().split('-')
      return {
        startDate: parts[0],
        endDate: parts[1],
      }
    }
  }

  filterKPIs(kpis, goal): string[] {
    switch(goal) {
      case 'vcr': {
        return kpis.filter(kpi => ['impressions', 'reach', 'frequency', 'vcr'].includes(kpi))
      }
      case 'vcr_actions': {
        return kpis.filter(kpi => ['impressions', 'reach', 'frequency', 'vcr', 'total_visits'].includes(kpi))
      }
      case 'vcr_actions_visits': {
        return kpis.filter(kpi => ['impressions', 'reach', 'frequency', 'vcr', 'online_visits', 'total_visits'].includes(kpi))
      }
      case 'ctr': {
        return kpis.filter(kpi => ['impressions', 'reach', 'frequency', 'clicks', 'ctr'].includes(kpi))
      }
      case 'ctr_vcr': {
        return kpis.filter(kpi => ['impressions', 'reach', 'frequency', 'clicks', 'ctr', 'vcr'].includes(kpi))
      }
      case 'ctr_actions': {
        return kpis.filter(kpi => ['impressions', 'reach', 'frequency', 'clicks', 'ctr', 'online_visits', 'total_visits'].includes(kpi))
      }
      case 'ctr_cpc': {
        return kpis.filter(kpi => ['impressions', 'reach', 'frequency', 'clicks', 'ctr', 'cpc'].includes(kpi))
      }
      case 'ctr_cpc_actions': {
        return kpis.filter(kpi => ['impressions', 'reach', 'frequency', 'clicks', 'cpc', 'ctr', 'online_visits', 'total_visits'].includes(kpi))
      }
      case 'all': {
        return kpis
      }
    }
  }
}

export class Metadata {
  readonly startDate?: string
  readonly endDate?: string
  readonly name?: string

  constructor(
    public readonly advertiser?: string,
    readonly dates?: Dates,
  ) {
    this.name = advertiser
    this.startDate = dates && dates.startDate
    this.endDate = dates && dates.endDate
  }
}

export interface ChartConfig {
  barMetric: string
  splines: string[]
}

export interface SearchAd {
  headline1: string
  headline2: string
  url: string
  description: string
}

export interface DisplayAd {
  image: string,
  width: number,
  height: number,
}

export class Item {
  public readonly searchAd: SearchAd
  public readonly displayAd: DisplayAd

  constructor(
    public readonly name?: string,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>,
    public readonly data?: any,
    public readonly product?: string,
    public readonly parent?: string,
    public readonly type?: string,
    public readonly breakdown?: string,
    public readonly breakdownName?: string,
  ) {
    if (this.product === 'google_ads') {
      this.searchAd = {
        headline1: this.data['headline_1'],
        headline2: this.data['headline_2'],
        url: this.data['final_url'],
        description: this.data['description'],
      }
    } else if (this.product === 'gam') {
      this.displayAd = {
        image: this.data['preview_url'],
        width: this.data['width'],
        height: this.data['height'],
      }
    } else if (this.product === 'google_display') {
      this.displayAd = {
        image: this.data['image_ad_url'],
        height: this.data['image_height'],
        width: this.data['image_width'],
      }
    } else if (this.product === 'facebook') {
      this.displayAd = {
        image: this.data['thumbnail_url'],
        height: 50,
        width: 50,
      }
    } else if (this.product === 'simplifi' && this.type === 'Image') {
      this.displayAd = {
        image: this.data['primary_creative_url'],
        height: 50,
        width: 50,
      }
    } else if (this.product === 'groundtruth') {
      this.displayAd = {
        image: this.data['url'],
        height: 50,
        width: 50,
      }
    }
  }
}

export class Region {
  public readonly region: string

  constructor(
    public readonly name: string,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>,
  ) {
    this.region = US_STATES_DEFINITIONS[name.toLowerCase()]
  }
}

export class Dma {
  public readonly name: string

  constructor(
    public readonly dma: string,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>,
  ) {
    this.name = dma.split(' ').join(", ")
  }
}

export const DMA_TRANSLATIONS = {
  'Abilene-Sweetwater TX': 'abilenesweetwater',
  'Albany GA': 'albanyga',
  'Albany-Schenectady-Troy NY': 'albanyschenectadytroy',
  'Albuquerque-Santa Fe NM': 'albuquerquesantafe',
  'Alexandria LA': 'alexandriala',
  'Alpena MI': 'alpena',
  'Amarillo TX': 'amarillo',
  'Atlanta GA': 'atlanta',
  'Augusta GA': 'augusta',
  'Austin TX': 'austin',
  'Bakersfield CA': 'bakersfield',
  'Baltimore MD': 'baltimore',
  'Bangor ME': 'bangor',
  'Baton Rouge LA': 'batonrouge',
  'Beaumont-Port Arthur TX': 'beaumontportarthur',
  'Bend OR': 'bendor',
  'Billings MT': 'billings',
  'Biloxi-Gulfport MS': 'biloxigulfport',
  'Binghamton NY': 'binghamton',
  'Birmingham AL': 'birminghamanntusc',
  'Bluefield-Beckley-Oak Hill WV': 'bluefieldbeckleyoakhill',
  'Boise ID': 'boise',
  'Boston MA-Manchester NH': 'bostonmanchester',
  'Bowling Green KY': 'bowlinggreen',
  'Buffalo NY': 'buffalo',
  'Burlington VT-Plattsburgh NY': 'burlingtonplattsburgh',
  'Butte-Bozeman MT': 'buttebozeman',
  'Casper-Riverton WY': 'casperriverton',
  'Cedar Rapids-Waterloo-Iowa City & Dubuque IA': 'cedarrapidswtrloiwcdub',
  'Champaign & Springfield-Decatur IL': 'champaignsprngflddecatur',
  'Charleston SC': 'charlestonsc',
  'Charleston-Huntington WV': 'charlestonhuntington',
  'Charlotte NC': 'charlotte',
  'Charlottesville VA': 'charlottesville',
  'Chattanooga TN': 'chattanooga',
  'Cheyenne WY-Scottsbluff NE': 'cheyennescottsbluf',
  'Chicago IL': 'chicago',
  'Chico-Redding CA': 'chicoredding',
  'Cincinnati OH': 'cincinnati',
  'Clarksburg-Weston WV': 'clarksburgweston',
  'Cleveland-Akron (Canton) OH': 'clevelandakroncanton',
  'Colorado Springs-Pueblo CO': 'coloradospringspueblo',
  'Columbia-Jefferson City MO': 'columbiajeffersoncity',
  'Columbia SC': 'columbiasc',
  'Columbus GA': 'columbusga',
  'Columbus OH': 'columbusoh',
  'Columbus-Tupelo-West Point MS': 'columbustupelowestpoint',
  'Corpus Christi TX': 'corpuschristi',
  'Dallas-Ft. Worth TX': 'dallasftworth',
  'Davenport IA-Rock Island-Moline IL': 'davenportrislandmoline',
  'Dayton OH': 'dayton',
  'Denver CO': 'denver',
  'Des Moines-Ames IA': 'desmoinesames',
  'Detroit MI': 'detroit',
  'Dothan AL': 'dothan',
  'Duluth MN-Superior WI': 'duluthsuperior',
  'Elmira NY': 'elmiracorning',
  'El Paso TX': 'elpasolascruces',
  'Erie PA': 'erie',
  'Eugene OR': 'eugene',
  'Eureka CA': 'eureka',
  'Evansville IN': 'evansville',
  'Fairbanks AK': 'fargovalleycity',
  'Flint-Saginaw-Bay City MI': 'flintsaginawbaycity',
  'Fresno-Visalia CA': 'fresnovisalia',
  'Ft. Myers-Naples FL': 'ftmyersnaples',
  'Ft. Smith-Fayetteville-Springdale-Rogers AR': 'ftsmithfaysprngdlrgrs',
  'Ft. Wayne IN': 'ftwayne',
  'Gainesville FL': 'gainesville',
  'Glendive MT': 'glendive',
  'Grand Junction-Montrose CO': 'grandjunctionmontrose',
  'Grand Rapids-Kalamazoo-Battle Creek MI': 'grandrapidskalmzoobcrk',
  'Great Falls MT': 'greatfalls',
  'Green Bay-Appleton WI': 'greenbayappleton',
  'Greensboro-High Point-Winston Salem NC': 'greensborohpointwsalem',
  'Greenville-New Bern-Washington NC': 'greenvillenbernwashngtn',
  'Greenville-Spartanburg SC-Asheville NC-Anderson SC': 'greenvllspartashevlland',
  'Greenwood-Greenville MS': 'greenwoodgreenville',
  'Harlingen-Weslaco-Brownsville-McAllen TX': 'harlingenwslcobrnsvlmca',
  'Harrisburg-Lancaster-Lebanon-York PA': 'harrisburglncstrlebyork',
  'Harrisonburg VA': 'harrisonburg',
  'Hartford & New Haven CT': 'hartfordnewhaven',
  'Hattiesburg-Laurel MS': 'hattiesburglaurel',
  'Helena MT': 'helena',
  'Houston TX': 'houston',
  'Huntsville-Decatur (Florence) AL': 'huntsvilledecaturflor',
  'Idaho Falls-Pocatello ID': 'idahofallspocatello',
  'Indianapolis IN': 'indianapolis',
  'Jackson MS': 'jacksonms',
  'Jackson TN': 'jacksontn',
  'Jacksonville FL': 'jacksonville',
  'Johnstown-Altoona PA': 'johnstownaltoona',
  'Jonesboro AR': 'jonesboro',
  'Joplin MO-Pittsburg KS': 'joplinpittsburg',
  'Kansas City MO': 'kansascity',
  'Knoxville TN': 'knoxville',
  'La Crosse-Eau Claire WI': 'lacrosseeauclaire',
  'Lafayette IN': 'lafayettein',
  'Lafayette LA': 'lafayettela',
  'Lake Charles LA': 'lakecharles',
  'Lansing MI': 'lansing',
  'Laredo TX': 'laredo',
  'Las Vegas NV': 'lasvegas',
  'Lexington KY': 'lexington',
  'Lima OH': 'lima',
  'Lincoln & Hastings-Kearney NE': 'lincolnhstngskrny',
  'Little Rock-Pine Bluff AR': 'littlerockpinebluff',
  'Los Angeles CA': 'losangeles',
  'Louisville KY': 'louisville',
  'Lubbock TX': 'lubbock',
  'Macon GA': 'macon',
  'Madison WI': 'madison',
  'Mankato MN': 'mankato',
  'Marquette MI': 'marquette',
  'Medford-Klamath Falls OR': 'medfordklamathfalls',
  'Memphis TN': 'memphis',
  'Meridian MS': 'meridian',
  'Miami-Ft. Lauderdale FL': 'miamiftlauderdale',
  'Milwaukee WI': 'milwaukee',
  'Minneapolis-St. Paul MN': 'minneapolisstpaul',
  'Minot-Bismarck-Dickinson(Williston) ND': 'minotbismarckdickinson',
  'Missoula MT': 'missoula',
  'Mobile AL-Pensacola (Ft. Walton Beach) FL': 'mobilepensacolaftwalt',
  'Monroe LA-El Dorado AR': 'monroeeldorado',
  'Monterey-Salinas CA': 'montereysalinas',
  'Montgomery (Selma) AL': 'montgomeryselma',
  'Florence-Myrtle Beach SC': 'myrtlebeachflorence',
  'Nashville TN': 'nashville',
  'New Orleans LA': 'neworleans',
  'New York NY': 'newyork',
  'Norfolk-Portsmouth-Newport News VA': 'norfolkportsmthnewptnws',
  'North Platte NE': 'northplatte',
  'Odessa-Midland TX': 'odessamidland',
  'Oklahoma City OK': 'oklahomacity',
  'Omaha NE': 'omaha',
  'Orlando-Daytona Beach-Melbourne FL': 'orlandodaytonabchmelbrn',
  'Ottumwa IA-Kirksville MO': 'ottumwakirksville',
  'Paducah KY-Cape Girardeau MO-Harrisburg-Mount Vernon IL': 'paducahcapegirardharsbg',
  'Palm Springs CA': 'palmsprings',
  'Panama City FL': 'panamacity',
  'Parkersburg WV': 'parkersburg',
  'Peoria-Bloomington IL': 'peoriabloomington',
  'Philadelphia PA': 'philadelphia',
  'Phoenix AZ': 'phoenixprescott',
  'Pittsburgh PA': 'pittsburgh',
  'Portland-Auburn ME': 'portlandauburn',
  'Portland OR': 'portlandor',
  'Presque Isle ME': 'presqueisle',
  'Providence RI-New Bedford MA': 'providencenewbedford',
  'Quincy IL-Hannibal MO-Keokuk IA': 'quincyhannibalkeokuk',
  'Raleigh-Durham (Fayetteville) NC': 'raleighdurhamfayetvlle',
  'Rapid City SD': 'rapidcity',
  'Reno NV': 'reno',
  'Richmond-Petersburg VA': 'richmondpetersburg',
  'Roanoke-Lynchburg VA': 'roanokelynchburg',
  'Rochester NY': 'rochesterny',
  'Rochester MN-Mason City IA-Austin MN': 'rochestrmasoncityaustin',
  'Rockford IL': 'rockford',
  'Sacramento-Stockton-Modesto CA': 'sacramntostktnmodesto',
  'Salisbury MD': 'salisbury',
  'Salt Lake City UT': 'saltlakecity',
  'San Angelo TX': 'sanangelo',
  'San Antonio TX': 'sanantonio',
  'San Diego CA': 'sandiego',
  'San Francisco-Oakland-San Jose CA': 'sanfranciscooaksanjose',
  'Santa Barbara-Santa Maria-San Luis Obispo CA': 'santabarbrasanmarsanluob',
  'Savannah GA': 'savannah',
  'Seattle-Tacoma WA': 'seattletacoma',
  'Sherman TX-Ada OK': 'shermanada',
  'Shreveport LA': 'shreveport',
  'Sioux City IA': 'siouxcity',
  'Sioux Falls(Mitchell) SD': 'siouxfallsmitchell',
  'South Bend-Elkhart IN': 'southbendelkhart',
  'Spokane WA': 'spokane',
  'Springfield MO': 'springfieldholyoke',
  'Springfield-Holyoke MA': 'springfieldmo',
  'St. Joseph MO': 'stjoseph',
  'St. Louis MO': 'stlouis',
  'Syracuse NY': 'syracuse',
  'Tallahassee FL-Thomasville GA': 'tallahasseethomasville',
  'Tampa-St. Petersburg (Sarasota) FL': 'tampastpetesarasota',
  'Terre Haute IN': 'terrehaute',
  'Toledo OH': 'toledo',
  'Topeka KS': 'topeka',
  'Traverse City-Cadillac MI': 'traversecitycadillac',
  'Tri-Cities TN-VA': 'tricitiestnva',
  'Tucson (Sierra Vista) AZ': 'tucsonsierravista',
  'Tulsa OK': 'tulsa',
  'Twin Falls ID': 'twinfalls',
  'Tyler-Longview(Lufkin & Nacogdoches) TX': 'tylerlongviewlfknncgd',
  'Utica NY': 'utica',
  'Victoria TX': 'victoria',
  'Waco-Temple-Bryan TX': 'wacotemplebryan',
  'Washington DC (Hagerstown MD)': 'washingtondchagrstwn',
  'Watertown NY': 'watertown',
  'Wausau-Rhinelander WI': 'wausaurhinelander',
  'West Palm Beach-Ft. Pierce FL': 'westpalmbeachftpierce',
  'Wheeling WV-Steubenville OH': 'wheelingsteubenville',
  'Wichita Falls TX & Lawton OK': 'wichitafallslawton',
  'Wichita-Hutchinson KS': 'wichitahutchinsonplus',
  'Wilkes Barre-Scranton PA': 'wilkesbarrescranton',
  'Wilmington NC': 'wilmington',
  'Yakima-Pasco-Richland-Kennewick WA': 'yakimapascorchlndknnwck',
  'Youngstown OH': 'youngstown',
  'Yuma AZ-El Centro CA': 'yumaelcentro',
  'Zanesville OH': 'zanesville',
}

const US_STATES_DEFINITIONS = {
  'alabama': 'us-al',
  'alaska': 'us-ak',
  'arizona': 'us-az',
  'arkansas': 'us-ar',
  'california': 'us-ca',
  'colorado': 'us-co',
  'connecticut': 'us-ct',
  'delaware': 'us-de',
  'dist of columbia': 'us-dc',
  'florida': 'us-fl',
  'georgia': 'us-ga',
  'hawaii': 'us-hi',
  'idaho': 'us-id',
  'illinois': 'us-il',
  'indiana': 'us-in',
  'iowa': 'us-ia',
  'kansas': 'us-ks',
  'kentucky': 'us-ky',
  'louisiana': 'us-la',
  'maine': 'us-me',
  'maryland': 'us-md',
  'massachusetts': 'us-ma',
  'michigan': 'us-mi',
  'minnesota': 'us-mn',
  'mississippi': 'us-ms',
  'missouri': 'us-mo',
  'montana': 'us-mt',
  'nebraska': 'us-ne',
  'nevada': 'us-nv',
  'new hampshire': 'us-nh',
  'new jersey': 'us-nj',
  'new mexico': 'us-nm',
  'new york': 'us-ny',
  'north carolina': 'us-nc',
  'north dakota': 'us-nd',
  'ohio': 'us-oh',
  'oklahoma': 'us-ok',
  'oregon': 'us-or',
  'pennsylvania': 'us-pa',
  'rhode island': 'us-ri',
  'south carolina': 'us-sc',
  'south dakota': 'us-sd',
  'tennessee': 'us-tn',
  'texas': 'us-tx',
  'utah': 'us-ut',
  'vermont': 'us-vt',
  'virginia': 'us-va',
  'washington': 'us-wa',
  'west virginia': 'us-wv',
  'wisconsin': 'us-wi',
  'wyoming': 'us-wy',
  'alabama, us': 'us-al',
  'alaska, us': 'us-ak',
  'arizona, us': 'us-az',
  'arkansas, us': 'us-ar',
  'california, us': 'us-ca',
  'colorado, us': 'us-co',
  'connecticut, us': 'us-ct',
  'delaware, us': 'us-de',
  'florida, us': 'us-fl',
  'georgia, us': 'us-ga',
  'hawaii, us': 'us-hi',
  'idaho, us': 'us-id',
  'illinois, us': 'us-il',
  'indiana, us': 'us-in',
  'iowa, us': 'us-ia',
  'kansas, us': 'us-ks',
  'kentucky, us': 'us-ky',
  'louisiana, us': 'us-la',
  'maine, us': 'us-me',
  'maryland, us': 'us-md',
  'michigan, us': 'us-mi',
  'minnesota, us': 'us-mn',
  'mississippi, us': 'us-ms',
  'missouri, us': 'us-mo',
  'montana, us': 'us-mt',
  'nebraska, us': 'us-ne',
  'nevada, us': 'us-nv',
  'new hampshire, us': 'us-nh',
  'new jersey, us': 'us-nj',
  'new mexico, us': 'us-nm',
  'new york, us': 'us-ny',
  'north carolina, us': 'us-nc',
  'north dakota, us': 'us-nd',
  'ohio, us': 'us-oh',
  'oklahoma, us': 'us-ok',
  'oregon, us': 'us-or',
  'pennsylvania, us': 'us-pa',
  'rhode island, us': 'us-ri',
  'south carolina, us': 'us-sc',
  'south dakota, us': 'us-sd',
  'tennessee, us': 'us-tn',
  'texas, us': 'us-tx',
  'utah, us': 'us-ut',
  'vermont, us': 'us-vt',
  'virginia, us': 'us-va',
  'washington, us': 'us-wa',
  'west virginia, us': 'us-wv',
  'wisconsin, us': 'us-wi',
  'wyoming, us': 'us-wy'
}
