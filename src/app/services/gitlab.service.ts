import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Gitlab, Issues, Projects } from '@gitbeaker/browser';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GitlabService {
  private issuesApi = new Issues({
    token: 'glpat-weCSsMue8KSJqf77-cRF',
  });

  private baseUrl = 'https://gitlab.com/api/v4';
  private token = 'glpat-weCSsMue8KSJqf77-cRF';

  constructor(private http: HttpClient) {}

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
