import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MainFooterComponent} from './main-footer.component';

describe('MainHeaderComponent', () => {
  let component: MainFooterComponent;
  let fixture: ComponentFixture<MainFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainFooterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
