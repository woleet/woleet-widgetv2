import { Component, OnInit, Input, ElementRef, AfterContentInit } from '@angular/core';

@Component({
  selector: 'file-hasher-widget',
  templateUrl: './file-hasher-widget.component.html',
  styleUrls: ['./file-hasher-widget.component.scss']
})
export class FileHasherWidgetComponent implements AfterContentInit {
  @Input() lang: string = document.documentElement.lang;
  @Input() config: any = {};

  constructor(private elementRef: ElementRef) {
    if (this.lang.length > 0) {
      this.config.lang = this.lang;
    }
  }

  ngAfterContentInit() {
    console.log('this.config', this.config);

    window['fileHasherWidget'].init([
      {
        id: this.config.id,
        el: this.elementRef.nativeElement,
        config: this.config
      }
    ]);
  }
}
