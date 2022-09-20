import { createAction, props } from "@ngrx/store";
import { Submission } from "src/models/submission";


export const submit = createAction('[Submit] Submit', props<{ submission: Submission }>());
export const submitSuccess = createAction('[Submit] Submit Success');
export const submitFailure = createAction('[Submit] Submit Failure', props<{ error: string }>());

export const fetchSubmissions = createAction('[Submission] Fetch Submission', props<{ submissionId: string, userId: string }>());
export const fetchSubmissionsSuccess = createAction('[Submission] Fetch Submission Success', props<{ submissions: Submission[] }>());
export const fetchSubmissionsFailure = createAction('[Submission] Fetch Submission Failure', props<{ error: string }>());

export const exEcution = createAction('[Execution] Execution', props<{ idSubmissions: string }>());
export const exEcutionSuccess = createAction('[Execution] Execution Success');
export const exEcutionFailure = createAction('[Execution] Execution Failure', props<{ error: string }>());

export const fetchSubmissionProblem = createAction('[Submission] Fetch Submission Problem', props<{ problemId: string }>());
export const fetchSubmissionProblemSuccess = createAction('[Submission] Fetch Submission Problem Success', props<{ submissions: Submission[] }>());
export const fetchSubmissionProblemFailure = createAction('[Submission] Fetch Submission Problem Failure', props<{ error: string }>());

export const fetchSubmissionDetail = createAction('[Submission] Fetch Submission Detail', props<{ submissionId: string }>());
export const fetchSubmissionDetailSuccess = createAction('[Submission] Fetch Submission Detail Success', props<{ submission: Submission }>());
export const fetchSubmissionDetailFailure = createAction('[Submission] Fetch Submission Detail Failure', props<{ error: string }>());