import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import Database, { QueryResult } from '@tauri-apps/plugin-sql';
import { TestResult } from './models/test-result';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy{
  elements: any[] = [];
  db: Database| undefined;
  constructor(){
    this.init();
  }
  ngOnDestroy(): void {
   this.db?.close();
  }
  
  async init(){
    this.db = await Database.load('sqlite:mydatabase.db');
    const t: TestResult = {
      id: 1,
      scenarioId: "scenario123",
      scenarioName: "Test Scenario",
      errorMessage: "No errors",
      uri: "https://example.com",
      flaky: false,
      gitlabIssueId: "issue123",
      gitlabProjectId: "project456",
      video: "https://example.com/video.mp4",
      expected: "true",
      result: "passed",
      date: new Date("2024-12-19T10:00:00")
  };
    // Utilisation avec l'objet `t` et une table `test_results`
    const { query, values } = this.generateInsertQuery("test_results", t);

    // Affichage de la requête générée
    console.log(query);  // La requête SQL générée
    console.log(values); // Les valeurs des paramètres
    //const r = db.execute(query, values);
    const r = await this.db.select("SELECT * FROM test_results");
    console.log(r);
  }
  generateInsertQuery(tableName: string, obj: any) {
    const keys = Object.keys(obj).filter(o => o !== "id").map(key => key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`));
    const values = Object.values(obj);
    values.shift(); 
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");
    const columns = keys.join(", ");

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders});`;
    return { query, values };
  }
  // Méthode pour basculer l'état de collapse d'un élément
  toggleCollapse(element: any): void {
    element.collapsed = !element.collapsed; // Inverse l'état
  }

  onGenerateGitLabIssue(step: any): void {
    console.log('Génération issue pour :', step);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.error('Aucun fichier sélectionné.');
      return;
    }

    const file = input.files[0];
    if (file.type !== 'application/json') {
      console.error('Veuillez sélectionner un fichier JSON.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        this.elements = JSON.parse(e.target?.result as string);

        this.elements.forEach((element: any) => {
          element.collapsed = false; // Initialiser à "non-collapsé"
          element.elements.forEach((e: any) => {
            e.status = e.steps.some((s: any) => s.result.status === 'failed')
              ? 'failed'
              : 'ok';
          });
        });
      } catch (error) {
        console.error('Erreur lors de l’analyse du fichier JSON :', error);
      }
    };

    reader.readAsText(file);
  }
}
