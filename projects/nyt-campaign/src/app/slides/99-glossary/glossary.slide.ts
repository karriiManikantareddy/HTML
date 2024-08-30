import {Component, Input} from '@angular/core'
import { NytSettingsService } from '../../services/nyt-settings.service'


interface GlossaryRecord {name: string, definition: string}

@Component({
  selector: 'glossary',
  templateUrl: './glossary.slide.html',
  styleUrls: ['./glossary.slide.less']
})
export class GlossarySlide {
  loading = true
  slides: GlossaryRecord[][] = []
  @Input() glossaryType: 'metric' | 'emotion'
  name: string
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  firstPartyGlossary = [
    {name: 'Booked Impressions', definition: 'The total number of impressions booked in DFP.'},
    {name: 'Served Impressions', definition: 'The total number of impressions served as recorded by DFP.'},
    {name: '% Delivered', definition: 'The total number of impressions booked in DFP through the total number of impressions served as recorded by DFP.'},
    {name: 'Clicks', definition: 'The total number of clicks served as recorded by DFP.'},
    {name: 'CTR', definition: 'The percentage of clicks out of served impressions.'},
    {name: 'Viewable Rate', definition: 'The amount of DFP Viewable Impressions through the amount of DFP Active view impressions.'},
    {name: 'Top Creative', definition: 'Displays the best performing creatives based on CTR'},
    {name: 'Top Line Items', definition: 'Displays the best performing line items based on clicks'},
  ]

  thirdPartyGossary = [
    {name: 'Booked Impressions', definition: 'The total number of impressions booked in DFP.'},
    {name: '3PT Served Impressions', definition: 'The total number of impressions served as recorded by the Third Party.'},
    {name: '% Delivered', definition: 'The total number of impressions booked in DFP through the total number of impressions served as recorded by the Third Party.'},
    {name: '3PT Clicks', definition: 'The total number of clicks served as recorded by the Third Party.'},
    {name: 'CTR', definition: 'The percentage of clicks out of served impressions.'},
    {name: 'Viewable Rate', definition: 'The amount of DFP Viewable Impressions through the amount of DFP Active view impressions.'},
    {name: 'Top Creative', definition: 'Displays the best performing creatives based on CTR'},
    {name: 'Top Line Items', definition: 'Displays the best performing line items based on clicks'},
  ]

  emotionGlossary = [
    {name: 'Adventurous', definition: 'Want to attract the thrill-seekers, the bold and unafraid? These stories feature content that keeps readers on the edge of their seats and takes them through an unexpected journey.'},
    {name: 'Amused', definition: 'From late night comedy to modern love and surprise appearances by celebrities, these fascinating stories captivate and entertain readers.'},
    {name: 'Boredom', definition: 'Interestingly enough, boredom is an emotion that propels our readers to want to engage with your messaging since they have time on their hands. In instances where our readers are less interested in what they\'re seeing, seize the moment to captivate their attention.'},
    {name: 'Competitive', definition: 'From Olympic athletes to the N.B.A, political races to the Patriots, our readers enjoy reading about sports and the various industries that require a competitive nature, such as politics, cooking, reality TV and more.'},
    {name: 'Curious', definition: 'The Times reader is curious, seeking to learn more about the world. Align with the pieces that teach our intrigued users, from science and technology to culture and the arts.'},
    {name: 'Disappointed', definition: 'In tumultuous times, readers turn to NYT for the latest in current events and editorial opinions. For brands taking stands and promoting CSR initiatives, become a part of the national conversation.'},
    {name: 'Happiness', definition: 'To balance the sometimes heavy news cycle, our readers often delight in taking a break from hard-hitting current events and enjoying the joy-filled, funny stories that make them smile.'},
    {name: 'Hope', definition: 'Whether a young chess player overcomes the odds to become a champion or a community comes together to help one of their own, these stories of achievement show the good pulsing through humanity, and how dreams can become reality.'},
    {name: 'Indulgent', definition: 'This targeting reaches people who admit that they’re a little extra. They like to indulge in the finer things in life, such as caviar, massive home restorations and luxury fashion, and they’re unafraid of owning it.'},
    {name: 'Informed', definition: 'From international relations to the latest in entertainment, our informed target features most relevant information that readers need to know in order to stay up-to-date.'},
    {name: 'Inspired', definition: 'Whether someone is making history as the first or there\'s a new landmark being unveiled, these stories allow readers to feel hopeful and encourages them to give their dreams a shot.'},
    {name: 'Interest', definition: 'NYT readers are curious and interested in a variety of topics. These stories range in subject matter, but always intrigue our readers, spark their passion for learning and ensure they\'re intellectually engaged.'},
    {name: 'Inthemoodtospend', definition: 'Whether our readers are looking at homes or engaged with stories and seeing money signs, our targeting can decipher which content evokes the desire to splurge. This allows you to stay top-of-mind too when our readers have their credit cards on the brain.'},
    {name: 'Love', definition: 'From a royal wedding announcement to a woman quitting her job to follow her passion, these stories are often pleasantly sweet and always heartwarming for all around good vibes.'},
    {name: 'Nostalgic', definition: 'We all enjoy a walk down memory lane, and our readers are no different. They love to hear about their childhood favorite artists, take a look back at an innovative career or revisit monumental moments in history.'},
    {name: 'Optimistic', definition: 'What does the F.D.A. finally finding a medication to prevent migraines and a celebrity rising from the ashes have in common? These stories make people feel hopeful for the future and inspire readers to think positively, walking around with their heads held high.'},
    {name: 'Selfconfident', definition: 'From covering the #metoo movement to a wave of overlooked people fighting for their rights, these stories are all about people unapologetically owning the spotlight and standing strong in their power.'},
    {name: 'Stressed', definition: 'In tumultuous times, readers turn to NYT for the latest in current events and editorial opinions. For brands taking stands and promoting CSR initiatives, become a part of the national conversation.'},
  ]

  constructor(
    settingsService: NytSettingsService,
  ) {
    settingsService.settingData('metricTypes').subscribe(metricTypeSetting => {
      const useThirdParty = !!(metricTypeSetting && metricTypeSetting.data === 'third')
      if (this.glossaryType === 'metric') {
        this.name = 'Glossary'
        if (useThirdParty) {
          this.slides.push(this.thirdPartyGossary)
        } else {
          this.slides.push(this.firstPartyGlossary)
        }
      } else {
        this.name = 'Glossary - Emotions'
        this.slides.push(this.emotionGlossary.slice(0, 9))
        this.slides.push(this.emotionGlossary.slice(9))
      }
      this.loading = false
    })
  }
}
