import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StearmingPerformanceComponent } from './stearming-performance.component';

describe('StearmingPerformanceComponent', () => {
  let component: StearmingPerformanceComponent;
  let fixture: ComponentFixture<StearmingPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StearmingPerformanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StearmingPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
