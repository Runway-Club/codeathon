import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProblemComponent } from './problem.component';

import { SpinkitComponent } from 'src/app/components/spinkit/spinkit.component';


@NgModule({
  declarations: [
    ProblemComponent,
    SpinkitComponent,
  ],
  imports: [
    CommonModule,
  ]
})
export class ProblemModule { }
