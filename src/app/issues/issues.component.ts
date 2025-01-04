import { Component } from '@angular/core';
import { DbService } from '../db.service';
import { IssueTemplate } from '../models/issue-template';
import { UiListComponent } from '../utils/ui-list/ui-list.component';
import { UiButtonComponent } from '../utils/ui-button/ui-button.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [UiListComponent, UiButtonComponent,CommonModule,RouterModule],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.css'
})
export class IssuesComponent  {
  templates: IssueTemplate[] = [];

  constructor(private dbService:DbService, private router:Router){
      dbService.get<IssueTemplate>("Select * from issue_template;").then((response)=> this.templates = response);
  }

  newTemplate(){
    const obj : IssueTemplate = {name: 'test'};
    this.dbService.create<IssueTemplate>(obj, "issue_template").then((response) => this.router.navigate([`settings/issue/${response?.lastInsertId}`]));
  }

  update(id: number){
    this.router.navigate([`settings/issue/${id}`])
  }
}
