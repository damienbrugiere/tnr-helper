import { Component } from '@angular/core';
import { DbService } from '../db.service';
import { Campaign } from '../models/campaign';
import { JsonPipe } from '@angular/common';
import { UiButtonComponent } from '../utils/ui-button/ui-button.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe, UiButtonComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private dbService: DbService, private router: Router){}

  newCampaign(){
   const c: Campaign = {name: "toto", date: new Date()};
   this.dbService.create<Campaign>(c ,  "campaign").then((response) => this.router.navigate([`/campaign/${response?.lastInsertId}`]));

  }
}
