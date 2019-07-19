import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ComponentModule} from '../components/components.module';

import {HomeComponent} from './home.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ComponentModule
  ],
  declarations: [
    HomeComponent
  ]
})

export class HomeModule {
}
