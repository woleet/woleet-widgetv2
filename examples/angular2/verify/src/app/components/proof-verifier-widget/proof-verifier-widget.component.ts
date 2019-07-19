import { Component, Input, ElementRef, AfterContentInit } from '@angular/core';

@Component({
  selector: 'proof-verifier-widget',
  templateUrl: './proof-verifier-widget.component.html',
  styleUrls: ['./proof-verifier-widget.component.scss']
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
