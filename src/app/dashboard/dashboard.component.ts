import { Component } from '@angular/core';
import { DbService } from '../db.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { TestResult } from '../models/test-result';
import { UiListComponent } from '../utils/ui-list/ui-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [JsonPipe,UiListComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  value: boolean = false;
  results!: TestResult[];
    constructor(private db: DbService){
      this.all();
    }
    all(){
      this.db.get<TestResult>("SELECT * from test_results;")
      .then((response:TestResult[]) => {console.log(response); this.results = response;});
    }
    // allFlaky(){
    //   this.db.get("SELECT scenario_id,  scenario_name, COUNT(*) AS flaky_count, GROUP_CONCAT(DISTINCT date ORDER BY date) AS flaky_dates FROM  test_results WHERE flaky = 1 GROUP BY scenario_id, scenario_name;")
    //   .then((response:unknown) => this.result = response);
    // }

    change(){
      this.value = !this.value;
      this.playSound(this.value);
    }

    playSound(isChecked: boolean): void {
      const audio = new Audio(isChecked ? 'assets/sounds/check.m4a' : 'assets/sounds/uncheck.m4a');
      audio.play();
    }
}
