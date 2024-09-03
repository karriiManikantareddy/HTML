import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoSlideComponent } from './logo-slide.component';

describe('LogoSlideComponent', () => {
  let component: LogoSlideComponent;
  let fixture: ComponentFixture<LogoSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoSlideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogoSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
