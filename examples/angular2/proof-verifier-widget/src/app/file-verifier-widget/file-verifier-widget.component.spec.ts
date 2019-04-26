import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileVerifierWidgetComponent } from './file-verifier-widget.component';

describe('FileVerifierWidgetComponent', () => {
  let component: FileVerifierWidgetComponent;
  let fixture: ComponentFixture<FileVerifierWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileVerifierWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileVerifierWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
