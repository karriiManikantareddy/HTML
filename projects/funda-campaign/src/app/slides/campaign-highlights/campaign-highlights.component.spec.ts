import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignHighlightsComponent } from './campaign-highlights.component';

describe('CampaignHighlightsComponent', () => {
  let component: CampaignHighlightsComponent;
  let fixture: ComponentFixture<CampaignHighlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignHighlightsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CampaignHighlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
