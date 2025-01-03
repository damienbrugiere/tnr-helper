import { Component, Input } from '@angular/core';
import { Campaign } from '../models/campaign';
import { CommonModule } from '@angular/common';
import { UiCheckBoxComponent } from '../utils/ui-checkbox/ui-checkbox.component';
import { FormsModule } from '@angular/forms';
import { UiChartComponent } from '../utils/ui-chart/ui-chart.component';

@Component({
  selector: 'ui-campaign',
  standalone: true,
  imports: [CommonModule, UiCheckBoxComponent, FormsModule, UiChartComponent],
  templateUrl: './ui-campaign.component.html',
  styleUrl: './ui-campaign.component.css'
})
export class UiCampaignComponent {

  checked: boolean = false;
  @Input()
  result!: Campaign;
}
