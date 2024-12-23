import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTitleCollapseComponent } from './ui-title-collapse.component';

describe('UiTitleCollapseComponent', () => {
  let component: UiTitleCollapseComponent;
  let fixture: ComponentFixture<UiTitleCollapseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTitleCollapseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiTitleCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
