import { Component } from '@angular/core'

@Component({
  selector: 'glossary',
  templateUrl: './glossary.slide.html',
  styleUrls: ['./glossary.slide.less']

})
export class GlossarySlide {
  glossary = [
    {metric: 'Impressies', definition: 'Aantal keer dat de advertentie is vertoond'},
    {metric: 'Klikken', definition: 'Klikken op een advertentie'},
    {metric: 'CTR', definition: 'Click Trough Rate: Het percentage van kliks t.o.v. het aantal impressies/vertoningen'},
    {metric: 'CPC', definition: 'Kosten per klik'},
    {metric: 'CPM', definition: 'Kosten per 1.000 impressies'},
    {metric: 'Viewability', definition: 'Percentage van impressies waarbij advertentie minimaal voor 50% in beeld is geweest voor 1 seconde'},
    {metric: 'Pacing', definition: 'Percentage dat de voortgang van de campagne weergeeft'},
  ]
}
