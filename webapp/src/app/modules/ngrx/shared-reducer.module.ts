import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { ProblemReducer } from 'src/app/ngrx/reducers/problems.reducer';
import { SubmissionReducer } from 'src/app/ngrx/reducers/submission.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({
      problem: ProblemReducer,
      submission: SubmissionReducer
    }, {}),
  ],
  exports: [
    StoreModule
  ]
})


export class SharedReducerModule { }
