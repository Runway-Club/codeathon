import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";

import { Submission } from "src/models/submission";
import { SubmissionActions } from "../actions/submission.action";
import { SubmissionService } from "src/app/services/submission.service";

import { of } from "rxjs";
import { map, switchMap, catchError } from "rxjs/operators";

@Injectable()
export class SubmissionEffects {
    constructor(
        private actions$: Actions,
        private submissionService: SubmissionService
    ) { }

    getSubmissions$ = createEffect(() => this.actions$.pipe(
        ofType(SubmissionActions.getSubmissions),
        switchMap((action) => {
            return this.submissionService.getSubmissions(action.problemID, action.userID)
        }),
        map((submissions: Submission[]) => {
            return SubmissionActions.getSubmissionsSuccess({ submissions })
        }),
        catchError((error: string) => {
            return of(SubmissionActions.getSubmissionsFailure({ error }))
        })
    ))

    getSubmission$ = createEffect(() => this.actions$.pipe(
        ofType(SubmissionActions.getSubmission),
        switchMap((action) => {
            return this.submissionService.getSubmission(action.id)
        }),
        map((submission) => {
            return SubmissionActions.getSubmissionSuccess({ submission })
        }),
        catchError((error: string) => {
            return of(SubmissionActions.getSubmissionFailure({ error }))
        }),
    ))

    createSubmission$ = createEffect(() => this.actions$.pipe(
        ofType(SubmissionActions.createSubmission),
        switchMap((action) => {
            return this.submissionService.createSubmission(action.submission)
        }),
        map((submission) => {
            if (!submission)
                return SubmissionActions.createSubmissionFailure({ error: 'Submission failed' })
            return SubmissionActions.createSubmissionSuccess({ submission })
        }),
        catchError((error: string) => {
            return of(SubmissionActions.createSubmissionFailure({ error }))
        })
    ))


}