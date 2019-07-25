import { Component, Input, ElementRef, AfterContentInit } from '@angular/core';

@Component({
  selector: 'div[proof-verifier-widget]',
  template: '<ng-content></ng-content>'
})
export class ProofVerifierWidgetComponent implements AfterContentInit {
  @Input() config: any = {};

  constructor(private elementRef: ElementRef) {}

  ngAfterContentInit() {
    console.log('this.config', this.config, window['fileVerifierWidget']);

    window['fileVerifierWidget'] && window['fileVerifierWidget'].init([
      {
        id: this.config.id,
        el: this.elementRef.nativeElement,
        config: this.config
      }
    ]);
  }
}
