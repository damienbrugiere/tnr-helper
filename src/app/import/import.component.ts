import { Component } from '@angular/core';
import { DbService } from '../db.service';
import { TestResult } from '../models/test-result';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [JsonPipe, CommonModule],
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
})
export class ImportComponent {
  private startDate!: number;
  public elements: TestResult[] | undefined;

  constructor(private db: DbService) {}

  // Méthode pour récupérer les données après initialisation
  ngOnInit() {

  }

  // Méthode pour basculer l'état de collapse d'un élément
  toggleCollapse(element: any): void {
    element.collapsed = !element.collapsed; // Inverse l'état
  }

  onGenerateGitLabIssue(step: any): void {
    console.log('Génération issue pour :', step);
  }

  init(){
    this.db.get('SELECT * FROM test_results WHERE date > $1', this.startDate).then((response: unknown) => {
      this.elements = response as TestResult[];
    });
  }

  onFileSelected(event: Event): void {
    this.startDate = new Date().getTime();
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
  
    reader.onload = async () => {
      try {
        const elements = JSON.parse(reader.result as string) as any[];
  
        if (!Array.isArray(elements)) {
          console.error('Le fichier JSON ne contient pas une liste valide.');
          return;
        }
  
        // Crée une promesse pour attendre la fin de l'insertion de tous les résultats
        const promises = elements.map(async (element) => {
          element.collapsed = false; // Initialiser à "non-collapsé"
  
          if (!element.elements || !Array.isArray(element.elements)) {
            console.warn(`L'élément avec l'id ${element.id} ne contient pas d'éléments valides.`);
            return;
          }
  
          for (const e of element.elements) {
            const failedStep = e.steps?.find((s: any) => s.result?.status === 'failed');
            if (!failedStep) {
              continue;
            }
  
            const errorMessage = failedStep.result?.error_message || '';
            const match = errorMessage.match(/features\/[^\s:]+/);
            const uri = match ? match[0] : undefined;
  
            const testResult: TestResult = {
              date: new Date(),
              scenarioId: element.id,
              scenarioName: element.name,
              errorMessage,
              uri,
              flaky: true,
            };
  
            // Attendez que l'insertion se termine avant de continuer
            await this.db.create(testResult);
          }
        });
  
        // Attendez que toutes les promesses de création se résolvent
        await Promise.all(promises);
  
        console.log('Traitement du fichier terminé');
        
        this.init();
      } catch (error) {
        console.error('Erreur lors de l’analyse du fichier JSON :', error);
      }
    };
  
    reader.readAsText(file);
  }
  
}
