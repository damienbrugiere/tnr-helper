import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import Database, { QueryResult } from '@tauri-apps/plugin-sql';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  elements: any[] = [];
  constructor(){
    this.init();
  }

  async init(){
    const db = await Database.load('sqlite:mydatabase.db');
    const reesult = await db.execute("INSERT into users (id, name) VALUES ($1, $2);",[1,"tutu"]);
    console.log(reesult);
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
