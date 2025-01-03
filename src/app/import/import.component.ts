import { Component } from '@angular/core';
import { DbService } from '../db.service';
import { TestResult } from '../models/test-result';
import { CommonModule, JsonPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Campaign } from '../models/campaign';
import { UiListComponent } from '../utils/ui-list/ui-list.component';
import { UiTitleCollapseComponent } from '../utils/ui-title-collapse/ui-title-collapse.component';
import { UiButtonComponent } from '../utils/ui-button/ui-button.component';
import { resourceDir } from '@tauri-apps/api/path';
import { create, BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
@Component({
  selector: 'app-import',
  standalone: true,
  imports: [JsonPipe, CommonModule, RouterModule, UiListComponent, UiTitleCollapseComponent, UiButtonComponent],
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
})
export class ImportComponent {
  public campaign!: Campaign;
  public elements: TestResult[] | undefined;

  constructor(private db: DbService, private route: ActivatedRoute) {}

  // Méthode pour récupérer les données après initialisation
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.initAll(id!);
    });
  }

  initAll(id: string){
    this.db.get<Campaign>("SELECT * FROM campaign where id = $1;", id).then((response) => { 
      this.campaign = response[0];
      this.init();
    });
  }
  init(){
    this.db.get<TestResult>("SELECT * FROM test_results where campaign_id = $1;", this.campaign.id).then((testResults) => {
      this.elements = testResults;
    }); 
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
  
    reader.onload = async () => {
      try {
        const elements = JSON.parse(reader.result as string) as any[];
        let failedCount = 0;
        let successCount = 0;
        let totalCount = 0;
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
            totalCount++;
            const failedStep = e.steps?.find((s: any) => s.result?.status === 'failed');
            if (!failedStep) {
              successCount++;
              continue;
            }
            failedCount++;
            const errorMessage = failedStep.result?.error_message || '';
            const match = errorMessage.match(/features\/[^\s:]+/);
            const uri = match ? match[0] : undefined;
  
            const testResult: TestResult = {
              date: new Date(),
              scenarioId: element.id,
              scenarioName: element.name,
              errorMessage,
              uri,
              flaky: false,
              campaignId: this.campaign.id!
            };
  
            // Attendez que l'insertion se termine avant de continuer
            await this.db.create(testResult, "test_results");
          }
        });

        // Attendez que toutes les promesses de création se résolvent
        await Promise.all(promises);
        this.campaign.failedCount = failedCount;
        this.campaign.successCount = successCount;
        this.campaign.totalCount = totalCount;
        console.log(this.campaign);
        await this.db.update(this.campaign, "campaign").then(() => {
          this.initAll(`${this.campaign.id}`);
        });
      } catch (error) {
        console.error('Erreur lors de l’analyse du fichier JSON :', error);
      }
    };
  
    reader.readAsText(file);
  }
  
  async generate(){

    this.replaceVariablesInHTML('_up_/src/assets/templates/index.html', {
      title: 'Ma page dynamique',
      tabs: JSON.stringify([
        { id: "London", title: "London tutu", content: "London is the capital city of England." },
        { id: "Paris", title: "Paris tutu", content: "Paris is the capital of France." },
        { id: "Tokyo", title: "Tokyo", content: "Tokyo is the capital of Japan." },
      ]),
    });
  }
  async replaceVariablesInHTML(filePath: string, replacements: Record<string, string>) {
    try {
      const fileContent = await readTextFile(filePath, { baseDir: BaseDirectory.Resource });
  
      let updatedContent = fileContent;
  
      for (const [key, value] of Object.entries(replacements)) {
        if (key === "tabs") {
          const tabsData = JSON.parse(value);
          const tabLinks = tabsData
            .map((tab: { id: string; title: string }) => `<button class="tablinks" onclick="openCity(event, '${tab.id}')">${tab.title}</button>`)
            .join("\n");
  
          const tabContents = tabsData
            .map((tab: { id: string; title: string; content: string }) => 
              `<div id="${tab.id}" class="tabcontent">
                <h3>${tab.title}</h3>
                <p>${tab.content}</p>
              </div>`)
            .join("\n");
  
          updatedContent = updatedContent
            .replace("${tab_links}", tabLinks)
            .replace("${tab_contents}", tabContents);
        } else {
          const variablePattern = new RegExp(`\\$\\{${key}\\}`, "g");
          updatedContent = updatedContent.replace(variablePattern, value);
        }
      }
  
      const outputPath = "_up_/src/assets/templates/index_updated.html";
      await writeTextFile(outputPath, updatedContent, { baseDir: BaseDirectory.Resource, createNew: true, create: true });
    } catch (error) {
      console.error("Erreur lors du remplacement des variables:", error);
    }
  }
  
  
}
