import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeTemplateComponent } from './node-template.component';

describe('NodeTemplateComponent', () => {
  let component: NodeTemplateComponent;
  let fixture: ComponentFixture<NodeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
