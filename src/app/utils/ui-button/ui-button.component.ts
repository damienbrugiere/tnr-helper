import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [],
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.css'
})
export class UiButtonComponent {

  @Input()
  type: "bug"|"flaky"|"link" ="bug";
  @Input()
  label: string ="";
  @Output()
  clickEvent: EventEmitter<void> = new EventEmitter<void>();

  click(): void{
    this.clickEvent.emit();
  }
}
