import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiChartComponent } from './ui-chart.component';

describe('UiChartComponent', () => {
  let component: UiChartComponent;
  let fixture: ComponentFixture<UiChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
