import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueTemplateComponent } from './issue-template.component';

describe('IssueTemplateComponent', () => {
  let component: IssueTemplateComponent;
  let fixture: ComponentFixture<IssueTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssueTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
