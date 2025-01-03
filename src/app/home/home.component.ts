import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { Campaign } from '../models/campaign';
import { CommonModule, JsonPipe } from '@angular/common';
import { UiButtonComponent } from '../utils/ui-button/ui-button.component';
import { Router, RouterModule } from '@angular/router';
import { UiCampaignComponent } from '../ui-campaign/ui-campaign.component';
import { UiListComponent } from '../utils/ui-list/ui-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe, UiButtonComponent, RouterModule, UiCampaignComponent, UiListComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  campaigns: Campaign[]=[];
  constructor(private dbService: DbService, private router: Router){}

  ngOnInit(): void {
    this.dbService.get<Campaign>("SELECT * FROM campaign ORDER BY date desc;").then((response) => this.campaigns = response);
  }

  newCampaign(){
   const date = new Date(); 
   const c: Campaign = {name: `Campagne de test du ${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`, date};
   this.dbService.create<Campaign>(c ,  "campaign").then((response) => this.router.navigate([`/campaign/${response?.lastInsertId}`]));

  }

  open(id: number){
    this.router.navigate([`/campaign/${id}`]);
  }

}
