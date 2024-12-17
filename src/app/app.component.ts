import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  elements:any[]=[];

  onAddStep(step: any): void {
    console.log('Ajout de l’étape :', step);
    // Implémente la logique pour ajouter ou traiter l'étape ici
  }

  onGenerateGitLabIssue(step: any): void {}
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

    // Lire le fichier en tant que texte
    reader.onload = (e) => {
      try {
        this.elements = JSON.parse(e.target?.result as string);
        this.elements.forEach((element:any) => {
           element.elements.forEach((e:any)=> {
            e.status = e.steps.some( (s: any)=> s.result.status === "failed")? "failed" : "ok";
          })
        });
      } catch (error) {
        console.error('Erreur lors de l’analyse du fichier JSON :', error);
      }
    };

    // Lire le fichier
    reader.readAsText(file);
  }
}
