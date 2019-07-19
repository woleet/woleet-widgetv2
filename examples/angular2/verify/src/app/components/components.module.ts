import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileHasherWidgetComponent } from './file-hasher-widget/file-hasher-widget.component';
import { ProofVerifierWidgetComponent } from './proof-verifier-widget/proof-verifier-widget.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    FileHasherWidgetComponent,
    ProofVerifierWidgetComponent
  ],
  providers: [],
  exports: [
    FileHasherWidgetComponent,
    ProofVerifierWidgetComponent
  ]
})

export class ComponentModule {
}
