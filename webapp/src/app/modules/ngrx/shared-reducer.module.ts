import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import {
  deleteProblemReducer,
  listingProblemReducer,
  problemCreationReducer,
  problemReducer,
  problemRetrievalReducer,
  problemUpdationReducer,
  resetSubmissionsReducer
} from 'src/reducers/problem.reducer';
import { authReducer } from 'src/reducers/auth.reducer';
import { profileReducer } from 'src/reducers/profile.reducer';
import { infoReducer } from 'src/reducers/info.reducer';
import { exEcutionReducer, submitReducer, SubmissionProblemReducer, SubmissionDetailReducer } from 'src/reducers/submit.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({
      auth: authReducer,
      problemCreation: problemCreationReducer,
      problemUpdation: problemUpdationReducer,
      problemRetrieval: problemRetrievalReducer,
      problemDeletion: deleteProblemReducer,
      problemResetSubmissions: resetSubmissionsReducer,
      problemListing: listingProblemReducer,
      problemSearching: problemReducer,
      profile: profileReducer,
      info: infoReducer,
      submit: submitReducer,
      exEcution: exEcutionReducer,
      SubmissionProblem: SubmissionProblemReducer,
      SubmissionDetail: SubmissionDetailReducer
    }, {}),
  ],
  exports: [
    StoreModule
  ]
})


export class SharedReducerModule { }
