import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidSearchSummaryComponent } from './paid-search-summary.component';

describe('PaidSearchSummaryComponent', () => {
  let component: PaidSearchSummaryComponent;
  let fixture: ComponentFixture<PaidSearchSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaidSearchSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaidSearchSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
