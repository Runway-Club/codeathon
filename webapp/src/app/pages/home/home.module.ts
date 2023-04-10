import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { SharedNebularModule } from 'src/app/modules/nebular/nebular.module';
import { ProblemsetComponent } from './components/problemset/problemset.component';
import { SharedModule } from 'src/app/modules/shared.module';


@NgModule({
  declarations: [
    HomeComponent,
    ProblemsetComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    SharedNebularModule
  ]
})
export class HomeModule { }
