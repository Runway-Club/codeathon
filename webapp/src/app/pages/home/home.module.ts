import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { SharedNebularModule } from 'src/app/modules/nebular/nebular.module';
import { ProblemsetComponent } from './components/problemset/problemset.component';
import { ManageProblemComponent } from './components/manage-problem/manage-problem.component';
import { SharedModule } from 'src/app/modules/shared.module';


@NgModule({
  declarations: [
    HomeComponent,
    ProblemsetComponent,
    ManageProblemComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    ManageProblemComponent,
    SharedNebularModule
  ]
})
export class HomeModule { }
