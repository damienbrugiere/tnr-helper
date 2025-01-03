import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiCheckBoxComponent } from '../ui-checkbox/ui-checkbox.component';
import { UiButtonComponent } from '../ui-button/ui-button.component';
import { TestResult } from '../../models/test-result';
import { CommonModule } from '@angular/common';
import { UiLinkComponent } from '../ui-link/ui-link.component';
import { DbService } from '../../db.service';
import { GitlabService } from '../../services/gitlab.service';
import { BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs';

@Component({
  selector: 'ui-title-collapse',
  standalone: true,
  imports: [FormsModule, UiCheckBoxComponent, UiButtonComponent, CommonModule, UiLinkComponent],
  templateUrl: './ui-title-collapse.component.html',
  styleUrl: './ui-title-collapse.component.css'
})
export class UiTitleCollapseComponent implements OnInit {
  checked: boolean= false;

  constructor(private dbService: DbService, private gitlabService: GitlabService){}
  
  @Input()
  result!: TestResult;

  ngOnInit(): void {
    this.computed(false);
  }

  flaky(): void{
    this.gitlabService.createIssue(65830619, "coucou", "ma super description !")   
    .then((issue) => {
      this.result!.flaky = true;
      this.result!.gitlabIssueId = issue.iid;
      this.dbService.update(this.result, "test_results");
      this.computed();
      // Lire le fichier index.html depuis les ressources
      readTextFile('_up_/src/assets/templates/index.html', {
        baseDir: BaseDirectory.Resource,
      }).then((content) => {
      // Créer un objet Blob à partir du contenu texte (type : 'text/html' pour un fichier HTML)
      const fileBlob = new Blob([content], { type: 'text/html' });

      // Créer un objet File avec le nom et le contenu
      const file = new File([fileBlob], "index.html", { type: 'text/html' });
      this.gitlabService.uploadFile(65830619, file).subscribe(
        (response) => {
          this.gitlabService.updateIssue(65830619, issue.iid, issue.description + " " + response.markdown).then((update) => console.log(update));
        },
        (error) => {
          // Gestion des erreurs
          console.error('Erreur lors de l\'upload du fichier:', error);
          alert('Erreur lors de l\'upload du fichier');
        }
      );
      });


    })
    .catch((err) => console.error('Erreur:', err));

  }
  issue(): void{
    this.gitlabService.createIssue(65830619, "coucou", "# ma super description ! \n tututut \n# lalala")   
    .then((issue) => {
      this.result!.gitlabIssueId = issue.iid;
      this.dbService.update(this.result, "test_results");
      this.computed();
    })
    .catch((err) => console.error('Erreur:', err));
  }

  private computed(sound: boolean= true): void{
    this.checked = this.result?.flaky === true || this.result?.gitlabIssueId !== null;
    if(sound){
      this.playSound(this.checked);
    }
  }

  // Gestion de l'audio
  playSound(isChecked: boolean): void {
    const audio = new Audio(isChecked ? 'assets/sounds/check.m4a' : 'assets/sounds/uncheck.m4a');
    audio.play();
  }
}
