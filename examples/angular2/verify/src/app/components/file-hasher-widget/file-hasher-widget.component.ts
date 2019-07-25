import { Component, Input, ElementRef, AfterContentInit } from '@angular/core';

@Component({
  selector: 'div[file-hasher-widget]',
  template: '<ng-content></ng-content>'
})
export class FileHasherWidgetComponent implements AfterContentInit {
  @Input() lang: string = document.documentElement.lang;
  @Input() config: any = {};

  constructor(private elementRef: ElementRef) {
    if (this.lang.length > 0) {
      this.config.lang = this.lang;
    }

    this.elementRef.nativeElement.classList.add('file-hasher-widget');
  }

  ngAfterContentInit() {
    console.log('this.config', this.config, window['fileHasherWidget']);

    window['fileHasherWidget'] && window['fileHasherWidget'].init([
      {
        id: this.config.id,
        el: this.elementRef.nativeElement,
        config: this.config
      }
    ]);
  }
}
