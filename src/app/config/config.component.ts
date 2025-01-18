import { Component } from '@angular/core';
import { GitlabService } from '../services/gitlab.service';
import { DbService } from '../db.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UiButtonComponent } from '../utils/ui-button/ui-button.component';
import { JsonPipe } from '@angular/common';
import { Config } from '../models/config';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [FormsModule,MatFormFieldModule, MatInputModule,MatCheckboxModule,UiButtonComponent, JsonPipe ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent {
  config!: Config;

  constructor(private gitlabService: GitlabService, private dbService:DbService){
    this.dbService.get<Config>("Select * from config;").then((values: Config[]) => {
      this.config = values[0];
    });
  }

  onSubmit(){
    this.dbService.update<Config>(this.config, "config").then(() =>{
      this.gitlabService.initConfig(this.config);
    })
  }
}
