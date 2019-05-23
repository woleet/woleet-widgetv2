import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private self = this;
  widget = 'File Verifier Widget';

  widgetConfig = {
    id: 'my-id-todo',
    lang: 'fr',
    verification: {
      server: false
    },
    mode: 'banner',
    styles: {
      zindex: 20,
      icon: {
        width: '32px',
        height: '36px'
      },
      banner: {
        width: '800px'
      }
    },
    receipt: {
      url: 'https://api.woleet.io/v1/receipt/54ceeadc-e2e2-4d37-b76c-432ddf4b3967'
    }
  };
}
