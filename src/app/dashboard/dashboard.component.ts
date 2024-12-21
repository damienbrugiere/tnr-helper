import { Component } from '@angular/core';
import { DbService } from '../db.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  result!: any;
    constructor(private db: DbService){
      this.allFlaky();
    }
    allFlaky(){
      this.db.get("SELECT scenario_id,  scenario_name, COUNT(*) AS flaky_count, GROUP_CONCAT(DISTINCT date ORDER BY date) AS flaky_dates FROM  test_results WHERE flaky = 1 GROUP BY scenario_id, scenario_name;")
      .then((response:unknown) => this.result = response);
    }



}
