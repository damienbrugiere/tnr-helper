import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCampaignComponent } from './ui-campaign.component';

describe('UiCampaignComponent', () => {
  let component: UiCampaignComponent;
  let fixture: ComponentFixture<UiCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCampaignComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
