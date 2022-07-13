import { createAction, props } from "@ngrx/store";
import { Submission } from "src/models/submission";


export const submit = createAction('[Submit] Submit', props<{ submission: Submission }>());
export const submitSuccess = createAction('[Submit] Submit Success');
export const submitFailure = createAction('[Submit] Submit Failure', props<{ error: string }>());

export const fetchSubmissions = createAction('[Submission] Fetch Submission', props<{ submissionId: string, userId: string }>());
export const fetchSubmissionsSuccess = createAction('[Submission] Fetch Submission Success', props<{ submissions: Submission[] }>());
export const fetchSubmissionsFailure = createAction('[Submission] Fetch Submission Failure', props<{ error: string }>());