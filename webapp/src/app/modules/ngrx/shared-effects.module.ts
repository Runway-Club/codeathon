import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { ProblemEffects } from 'src/app/ngrx/effects/problems.effect';
import { SubmissionEffects } from 'src/app/ngrx/effects/submission.effect';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forRoot([
      ProblemEffects,
      SubmissionEffects
    ]),
  ],
  exports: [
    EffectsModule
  ]
})
export class SharedEffectsModule { }
