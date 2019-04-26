import { Component, Input, ElementRef, AfterContentInit } from '@angular/core';

@Component({
  selector: 'file-verifier-widget',
  templateUrl: './file-verifier-widget.component.html',
  styleUrls: ['./file-verifier-widget.component.scss']
})
export class FileVerifierWidgetComponent implements AfterContentInit {
  @Input() config: any = {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    console.log('this.config', this.config);

    setTimeout(() => {
      window['fileVerifierWidget'].init([
        {
          el: this.elementRef.nativeElement,
          config: this.config
        }
      ]);
    }, 50);
  }

  ngAfterContentInit() {
    window['fileVerifierWidget'].init([
      {
        el: this.elementRef.nativeElement,
        config: this.config
      }
    ]);
  }

}
