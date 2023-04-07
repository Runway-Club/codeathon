import { DocumentSnapshot } from '@angular/fire/firestore';
import { createAction, props } from '@ngrx/store';
import { Problem } from 'src/models/problem.model';

export const createProblem = createAction(
  '[Problem] Create Problem',
  props<{ problem: Problem }>()
);
export const createProblemSuccess = createAction(
  '[Problem] Create Problem Success'
);
export const createProblemFailure = createAction(
  '[Problem] Create Problem Failure',
  props<{ error: string }>()
);

export const updateProblem = createAction(
  '[Problem] Update Problem',
  props<{ id: string; problem: Problem }>()
);
export const updateProblemSuccess = createAction(
  '[Problem] Update Problem Success'
);
export const updateProblemFailure = createAction(
  '[Problem] Update Problem Failure',
  props<{ error: string }>()
);

export const getProblem = createAction(
  '[Problem] Get Problem',
  props<{ id: string }>()
);
export const getProblemSuccess = createAction(
  '[Problem] Get Problem Success',
  props<{ problem: Problem }>()
);
export const getProblemFailure = createAction(
  '[Problem] Get Problem Failure',
  props<{ error: string }>()
);

export const deleteProblem = createAction(
  '[Problem] Delete Problem',
  props<{ id: string }>()
);
export const deleteProblemSuccess = createAction(
  '[Problem] Delete Problem Success'
);
export const deleteProblemFailure = createAction(
  '[Problem] Delete Problem Failure',
  props<{ error: string }>()
);

export const resetSubmissions = createAction(
  '[Problem] Reset Submissions',
  props<{ id: string }>()
);
export const resetSubmissionsSuccess = createAction(
  '[Problem] Reset Submissions Success'
);
export const resetSubmissionsFailure = createAction(
  '[Problem] Reset Submissions Failure',
  props<{ error: string }>()
);

export const listingProblem = createAction(
  '[Problem] List Problem',
  props<{ prevDoc?: DocumentSnapshot }>()
);
export const listingProblemSuccess = createAction(
  '[Problem] List Problem Success',
  props<{ problems: Problem[] }>()
);
export const listingProblemFailure = createAction(
  '[Problem] List Problem Failure',
  props<{ error: string }>()
);

export const searchProblem = createAction(
  '[Problem] Search Problem',
  props<{ query: string }>()
);
export const searchProblemSuccess = createAction(
  '[Problem] Search Problem Success',
  props<{ problems: Problem[] }>()
);
export const searchProblemFailure = createAction(
  '[Problem] Search Problem Failure',
  props<{ error: string }>()
);

export const getUserProblem = createAction(
  "[Problem] Get User's Problem",
  props<{ userId: string }>()
);
export const getUserProblemSuccess = createAction(
  "[Problem] Get User's Problem",
  props<{ problems: Problem[] }>()
);
export const getUserProblemFailure = createAction(
  "[Problem] Get User's Problem",
  props<{ error: string }>()
);
