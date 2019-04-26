import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FileVerifierWidgetComponent } from './file-verifier-widget/file-verifier-widget.component';

@NgModule({
  declarations: [
    AppComponent,
    FileVerifierWidgetComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
