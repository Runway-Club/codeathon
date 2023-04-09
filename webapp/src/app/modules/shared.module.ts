import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinkitComponent } from '../components/spinkit/spinkit.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { SharedNebularModule } from './nebular/nebular.module';

@NgModule({
  declarations: [
    SpinkitComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedNebularModule
  ],
  exports: [
    SpinkitComponent,
    NavbarComponent
  ]
})

export class SharedModule { }
