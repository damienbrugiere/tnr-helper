import { Component, Input } from '@angular/core';
import { UiTitleCollapseComponent } from '../ui-title-collapse/ui-title-collapse.component';
import { TestResult } from '../../models/test-result';
import { CommonModule } from '@angular/common';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'ui-list',
  standalone: true,
  imports: [UiTitleCollapseComponent, CommonModule],
  templateUrl: './ui-list.component.html',
  styleUrl: './ui-list.component.css',
  animations: [
    trigger('staggerAnimation', [
      transition(':enter', [
        query('.item', [
          style({ opacity: 0, transform: 'translateX(300px)' }),
          stagger(50, [
            animate('200ms 200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class UiListComponent {

  @Input()
  results: TestResult[] | undefined;
}
