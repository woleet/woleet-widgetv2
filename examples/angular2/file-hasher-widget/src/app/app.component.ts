import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private self = this;
  hash;
  file;
  isPreviewable;
  progress;
  fileUrl;
  downloadProgress;
  downloadedFile;
  error;

  widget = 'File Hasher Widget';

  widgetConfig = {
    id: 'my-id-todo',
    lang: 'fr',
    styles: {
      width: '250px'
    },
    observers: {
      hashingStarted: (widgetId, file, isPreviewable) => { this.hashingStarted(widgetId, file, isPreviewable); },
      hashingCanceled: (widgetId) => { this.hashingCanceled(widgetId); },
      hashingProgress: (widgetId, progress) => { this.hashingProgress(widgetId, progress); },
      hashCalculated: (widgetId, hash) => { this.hashCalculated(widgetId, hash); },
      downloadingStarted: (widgetId, url) => { this.downloadingStarted(widgetId, url); },
      downloadingProgress: (widgetId, progress) => { this.downloadingProgress(widgetId, progress); },
      downloadingCanceled: (widgetId) => { this.downloadingCanceled(widgetId); },
      downloadingFinished: (widgetId, file) => { this.downloadingFinished(widgetId, file); },
      downloadingFailed: (widgetId, code, status, message) => { this.downloadingFailed(widgetId, code, status, message); },
      widgetReset: (widgetId) => { this.widgetReset(widgetId); }
    }
  };

  hashingStarted(widgetId, file, isPreviewable) {
    console.log('hashingStarted', file, isPreviewable);
    this.file = file;
    this.isPreviewable = isPreviewable;
  }

  hashingCanceled(widgetId) {
    console.log('hashingCanceled');
    this.hash = null;
  }

  hashingProgress(widgetId, progress) {
    console.log('hashingProgress', progress);
    this.progress = progress;
  }

  hashCalculated(widgetId, hash) {
    console.log('hashCalculated', hash);
    this.hash = hash;
  }

  downloadingStarted(widgetId, url) {
    console.log('downloadingStarted', url);
    this.fileUrl = url;
  }

  downloadingProgress(widgetId, progress) {
    console.log('downloadingProgress', progress);
    this.downloadProgress = progress;
  }

  downloadingCanceled(widgetId) {
    console.log('downloadingCanceled');
  }

  downloadingFinished(widgetId, file) {
    console.log('downloadingFinished', file);
    this.downloadedFile = file;
  }

  downloadingFailed(widgetId, code, status, message) {
    console.log('downloadingFailed', code, status, message);
    this.error.code = code;
    this.error.status = status;
    this.error.message = message;
  }

  widgetReset(widgetId) {
    console.log('widgetReset');
  }

  reset() {
    window.fileHasherWidget.reset(this.widgetConfig.id);
  }
}
