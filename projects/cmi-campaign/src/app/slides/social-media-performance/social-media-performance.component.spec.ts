import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaPerformanceComponent } from './social-media-performance.component';

describe('SocialMediaPerformanceComponent', () => {
  let component: SocialMediaPerformanceComponent;
  let fixture: ComponentFixture<SocialMediaPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialMediaPerformanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocialMediaPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
