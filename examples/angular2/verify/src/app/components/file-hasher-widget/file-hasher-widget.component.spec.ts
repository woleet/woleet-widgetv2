import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileHasherWidgetComponent } from './file-hasher-widget.component';

describe('FileHasherWidgetComponent', () => {
  let component: FileHasherWidgetComponent;
  let fixture: ComponentFixture<FileHasherWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileHasherWidgetComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileHasherWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
