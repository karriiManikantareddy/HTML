import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingNetworkComponent } from './streaming-network.component';

describe('StreamingNetworkComponent', () => {
  let component: StreamingNetworkComponent;
  let fixture: ComponentFixture<StreamingNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamingNetworkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StreamingNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
