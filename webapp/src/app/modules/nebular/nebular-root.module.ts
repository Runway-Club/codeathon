import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  NbThemeModule,
  NbToastrModule,
  NbMenuModule
} from '@nebular/theme';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NbThemeModule.forRoot({ name: 'dark' }),
    NbToastrModule.forRoot(),
    NbMenuModule.forRoot()
  ],
  exports: [
    NbThemeModule,
    NbToastrModule,
    NbMenuModule
  ]
})
export class SharedNebularRootModule { }
