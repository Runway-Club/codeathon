import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Home2RoutingModule } from './home2-routing.module';
import { Home2Component } from './home2.component';

import { SharedNebularModule } from 'src/app/modules/nebular/nebular.module';
import { ProblemsetComponent } from './components/problemset/problemset.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';


@NgModule({
  declarations: [
    Home2Component,
    ProblemsetComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    Home2RoutingModule,
    SharedNebularModule
  ]
})
export class Home2Module { }
