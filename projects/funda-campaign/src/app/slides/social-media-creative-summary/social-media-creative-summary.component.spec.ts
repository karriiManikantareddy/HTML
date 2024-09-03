import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaCreativeSummaryComponent } from './social-media-creative-summary.component';

describe('SocialMediaCreativeSummaryComponent', () => {
  let component: SocialMediaCreativeSummaryComponent;
  let fixture: ComponentFixture<SocialMediaCreativeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialMediaCreativeSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocialMediaCreativeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
