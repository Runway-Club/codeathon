import { createAction, props } from "@ngrx/store"
import { Submission } from "src/models/submission"
import { DocumentSnapshot } from "@angular/fire/firestore"

export const SubmissionActions = {
    getSubmissions: createAction('[Submission] Get Submissions', props<{ problemID: string, userID: string }>()),
    getSubmissionsSuccess: createAction('[Submission] Get Submissions Success', props<{ submissions: Submission[] }>()),
    getSubmissionsFailure: createAction('[Submission] Get Submissions Failure', props<{ error: string }>()),

    getSubmission: createAction('[Submission] Get Submission', props<{ id: string }>()),
    getSubmissionSuccess: createAction('[Submission] Get Submission Success', props<{ submission: Submission }>()),
    getSubmissionFailure: createAction('[Submission] Get Submission Failure', props<{ error: string }>()),

    createSubmission: createAction('[Submission] Create Submission', props<{ submission: Submission }>()),
    createSubmissionSuccess: createAction('[Submission] Create Submission Success', props<{ submission: Submission }>()),
    createSubmissionFailure: createAction('[Submission] Create Submission Failure', props<{ error: string }>()),

    // deleteSubmission: createAction('[Submission] Delete Submission', props<{ id: string }>()),
    // deleteSubmissionSuccess: createAction('[Submission] Delete Submission Success'),
    // deleteSubmissionFailure: createAction('[Submission] Delete Submission Failure', props<{ error: string }>()),
}