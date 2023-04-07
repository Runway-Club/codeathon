import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { AuthEffects } from 'src/effects/auth.effect';
import { ProblemEffects } from 'src/effects/problem.effect';
import { ProfileEffects } from 'src/effects/profile.effect';
import { InfoEffects } from 'src/effects/info.effect';
import { SubmitEffects } from 'src/effects/submit.effect';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forRoot([
      AuthEffects,
      ProblemEffects,
      ProfileEffects,
      InfoEffects,
      SubmitEffects
    ]),
  ],
  exports: [
    EffectsModule
  ]
})
export class SharedEffectsModule { }
