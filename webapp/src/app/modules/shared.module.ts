import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinkitComponent } from '../components/spinkit/spinkit.component';
@NgModule({
  declarations: [
    SpinkitComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SpinkitComponent
  ]
})

export class SharedModule { }
