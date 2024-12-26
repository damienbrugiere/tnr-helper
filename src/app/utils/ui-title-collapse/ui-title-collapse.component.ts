import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiCheckBoxComponent } from '../ui-checkbox/ui-checkbox.component';
import { UiButtonComponent } from '../ui-button/ui-button.component';
import { TestResult } from '../../models/test-result';
import { CommonModule } from '@angular/common';
import { UiLinkComponent } from '../ui-link/ui-link.component';
import { DbService } from '../../db.service';

@Component({
  selector: 'ui-title-collapse',
  standalone: true,
  imports: [FormsModule, UiCheckBoxComponent, UiButtonComponent, CommonModule, UiLinkComponent],
  templateUrl: './ui-title-collapse.component.html',
  styleUrl: './ui-title-collapse.component.css'
})
export class UiTitleCollapseComponent implements OnInit {
  checked: boolean= false;

  constructor(private dbService: DbService){}
  
  @Input()
  result!: TestResult;

  ngOnInit(): void {
    this.computed(false);
  }

  flaky(): void{
    this.result!.flaky = true;
    this.result!.gitlabIssueId = "12012";
    this.dbService.update(this.result, "test_results");
    this.computed();
  }
  issue(): void{
    this.result!.gitlabIssueId = "12012";
    this.dbService.update(this.result, "test_results");
    this.computed();
  }

  private computed(sound: boolean= true): void{
    this.checked = this.result?.flaky === true || this.result?.gitlabIssueId !== null;
    if(sound){
      this.playSound(this.checked);
    }else{
      console.log(this.result?.flaky === true || this.result?.gitlabIssueId !== null);
    }
  }

  // Gestion de l'audio
  playSound(isChecked: boolean): void {
    const audio = new Audio(isChecked ? 'assets/sounds/check.m4a' : 'assets/sounds/uncheck.m4a');
    audio.play();
  }
}
