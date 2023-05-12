import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinkitComponent } from '../components/spinkit/spinkit.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { PaginateComponent } from '../components/paginate/paginate.component';

import { RouterModule } from '@angular/router';
import { SharedNebularModule } from './nebular/nebular.module';

@NgModule({
  declarations: [
    SpinkitComponent,
    NavbarComponent,
    PaginateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedNebularModule
  ],
  exports: [
    SpinkitComponent,
    NavbarComponent,
    PaginateComponent
  ]
})

export class SharedModule { }
