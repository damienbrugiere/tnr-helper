import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Issues } from '@gitbeaker/browser';
import { Observable } from 'rxjs';
import { DbService } from '../db.service';
import { Config } from '../models/config';
@Injectable({
  providedIn: 'root'
})
export class GitlabService {
  private issuesApi: any;
  private baseUrl!: string;
  private token!: string;

  constructor(private http: HttpClient, private dbService: DbService) {
    dbService.get<Config>("Select * from config;").then((values: Config[])=> {
      const config = values[0];
      this.initConfig(config);
    });
  }

  initConfig(config: Config){
    this.setBaseUrl(config.baseUrl);
    this.setApiKey(config.apiKey);
  }
  setBaseUrl(baseUrl: string){
    this.baseUrl = baseUrl;
  }

  setApiKey(apiKey: string){
    this.token = apiKey;
    this.issuesApi =  new Issues({
      token: apiKey
    });
  }
  // Méthode pour uploader un fichier vers un projet
  uploadFile(projectId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders().set('PRIVATE-TOKEN', this.token);

    return this.http.post<any>(
      `${this.baseUrl}/projects/${projectId}/uploads`,
      formData,
      { headers }
    );
  }
  // Créer une issue
  createIssue( projectId: number, title: string, description: string): Promise<any> {
    return this.issuesApi.create(projectId, { title, description });
  }

  
  // Mettre à jour la description d'une issue
  async updateIssue(projectId: number, issueId: number, description: string): Promise<any> {
    const issueUpdate = await this.issuesApi.edit(projectId, issueId, { description });
    return issueUpdate;
  }
}
