import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileHasherWidgetComponent } from './file-hasher-widget/file-hasher-widget.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    FileHasherWidgetComponent
  ],
  providers: [],
  exports: [
    FileHasherWidgetComponent
  ]
})

export class ComponentModule {
}
