import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSiteAppComponent } from './video-site-app.component';

describe('VideoSiteAppComponent', () => {
  let component: VideoSiteAppComponent;
  let fixture: ComponentFixture<VideoSiteAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoSiteAppComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoSiteAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
