import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  NbThemeModule,
  NbToastrModule,
  NbMenuModule,
  NbSelectModule
} from '@nebular/theme';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NbThemeModule.forRoot({ name: 'dark' }),
    NbToastrModule.forRoot(),
    NbMenuModule.forRoot(),
    NbSelectModule
  ],
  exports: [
    NbThemeModule,
    NbToastrModule,
    NbMenuModule,
    NbSelectModule
  ]
})
export class SharedNebularRootModule { }
