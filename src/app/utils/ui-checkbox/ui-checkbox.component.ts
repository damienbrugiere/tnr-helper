import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-checkbox',
  templateUrl: './ui-checkbox.component.html',
  styleUrls: ['./ui-checkbox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiCheckBoxComponent),
      multi: true,
    },
  ],
  standalone:true
})
export class UiCheckBoxComponent implements ControlValueAccessor {

  @Input() label: string | undefined; // Texte de la checkbox

  @Input() disabled: boolean = true; // État désactivé
  checked: boolean = false; // État local de la checkbox
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  // Lecture d'un état externe dans le composant
  writeValue(value: boolean): void {
    this.checked = value;
  }
  onCheckboxChange(event: Event): void {
    if (this.disabled) return; // Ignore les interactions si désactivé
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checked = isChecked;
    this.onChange(isChecked); // Notification au modèle parent
    this.playSound(isChecked);
  }
  // Enregistrement des callbacks pour les interactions avec Angular
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Gestion de l'audio
  playSound(isChecked: boolean): void {
    const audio = new Audio(isChecked ? 'assets/sounds/check.m4a' : 'assets/sounds/uncheck.m4a');
    audio.play();
  }
}
