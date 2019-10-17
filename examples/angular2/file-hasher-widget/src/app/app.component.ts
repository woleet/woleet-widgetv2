import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private self = this;
  hashes = [];
  files = [];
  widget = 'File Hasher Widget';

  widgetConfig = {
    id: 'my-id-todo',
    lang: 'fr',
    styles: {
      width: '250px'
    },
    observers: {
      hashCalculated: (widgetId, hash) => {this.hashCalculated(widgetId, hash)},
      downloadingFinished: (widgetId, file) => {this.downloadingFinished(widgetId, file)}
    }
  };

  hashCalculated(widgetId, hash) {
    this.hashes.push({
      widgetId, hash
    })
  }

  downloadingFinished(widgetId, file) {
    this.files.push({
      widgetId, file
    })
  }
}
