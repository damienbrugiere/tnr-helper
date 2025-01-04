import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { UiButtonComponent } from '../utils/ui-button/ui-button.component';
import { ActivatedRoute } from '@angular/router';
import { DbService } from '../db.service';
import { IssueTemplate } from '../models/issue-template';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-issue-template',
  standalone: true,
  imports: [FormsModule,MatFormFieldModule, MatInputModule,MatCheckboxModule,UiButtonComponent, JsonPipe ],
  templateUrl: './issue-template.component.html',
  styleUrl: './issue-template.component.css',
  providers:[
      {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {floatLabel: 'always'}}]
})
export class IssueTemplateComponent implements OnInit {
  issueTemplate!: IssueTemplate;
  constructor(private db: DbService, private route: ActivatedRoute){}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.init(id!);
    });
  }

  init(id: string){
    this.db.get<IssueTemplate>("SELECT * FROM issue_template where id = $1;", id).then((response) => { 
      this.issueTemplate = response[0];
    });
  }

  onSubmit(){
    this.db.update(this.issueTemplate, "issue_template");
  }
}
