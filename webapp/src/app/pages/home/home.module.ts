import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { SharedNebularModule } from 'src/app/modules/nebular/nebular.module';
import { ProblemsetComponent } from './components/problemset/problemset.component';
import { SharedModule } from 'src/app/modules/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    ProblemsetComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,

    SharedModule,
    SharedNebularModule
  ]
})
export class HomeModule { }
