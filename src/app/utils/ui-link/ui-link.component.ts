import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UiButtonComponent } from '../ui-button/ui-button.component';

@Component({
  selector: 'ui-link',
  standalone: true,
  imports: [ RouterModule, UiButtonComponent],
  templateUrl: './ui-link.component.html',
  styleUrl: './ui-link.component.css'
})
export class UiLinkComponent {
  @Input()
  public label!: string;
  @Input()
  public link!: string;

  constructor(private router: Router){}

  action(): void{
    this.router.navigateByUrl(this.link);
  }
}