import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FileHasherWidgetComponent } from './components/file-hasher-widget.component';

@NgModule({
  declarations: [
    AppComponent,
    FileHasherWidgetComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
