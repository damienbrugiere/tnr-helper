import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'ui-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './ui-chart.component.html',
  styleUrl: './ui-chart.component.css'
})
export class UiChartComponent implements OnInit{

  @Input()
  public success!: number;
  @Input()
  public failed!: number;
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartLabels = [ 'Succès', 'Erreurs'];
  public pieChartDatasets: any = [];
  public pieChartLegend = false;
  public pieChartPlugins = [];
  ngOnInit(): void {
    this.pieChartDatasets = [ {
      data: [this.success, this.failed ]
    } ];
  }
}
