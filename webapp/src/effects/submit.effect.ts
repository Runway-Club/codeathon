import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { doc, docSnapshots, Firestore, getDocs, limit, orderBy, collectionChanges } from "@angular/fire/firestore";
import { collection, onSnapshot, query, where, getDoc } from "@firebase/firestore";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map, catchError, of, from } from "rxjs";
import { SubmissionService } from "src/app/services/submission.service";
import { environment } from "src/environments/environment";
import { Submission } from "src/models/submission";
import * as Action from '../actions/submit.action';

@Injectable()
export class SubmitEffects {
    constructor(
        private action$: Actions,
        private http: HttpClient,
        private db: Firestore,
        private SubmissionService: SubmissionService
    ) { }

    submit$ = createEffect(() => this.action$.pipe(
        ofType(Action.submit),
        switchMap(action => {
            // console.log(action.submission);
            return this.http.post(environment.api + '/execution/', action.submission)
        }),
        map(res => { return Action.submitSuccess() }),
        catchError(error => of(Action.submitFailure({ error: error.message })))));

    fetchMySubmissions$ = createEffect(() => this.action$.pipe(
        ofType(Action.fetchSubmissions),
        switchMap(action => this.SubmissionService.fetchSubmission(action.problemId, action.userId)),
        map(
            (submissions) => {
                return Action.fetchSubmissionsSuccess({ submissions: submissions.map(value => value.data()) as Submission[] })
            },
            catchError(
                error => of(
                    Action.exEcutionFailure({ error: error.message })
                )
            )
        ))
    );

    execution$ = createEffect(() => this.action$.pipe(
        ofType(Action.exEcution),
        switchMap(action => this.http.get(environment.api + `/execution/${action.idSubmissions}`)),
        map(() => Action.exEcutionSuccess(),
            catchError(error => of(Action.exEcutionFailure({ error: error.message })))))
    )

    fetchSubmissionProblem$ = createEffect(() => this.action$.pipe(
        ofType(Action.fetchSubmissionProblem),
        switchMap((action) => {

            const QUERY = query(collection(this.db, "submissions"),
                where("problem_id", "==", action.problemId),
                limit(20)
            );
            return from(getDocs(QUERY));
        }),
        map(res => {
            let submissions: Submission[] = [];
            for (let i = 0; i < res.docs.length; i++) {
                submissions.push(res.docs[i].data() as Submission);
            }
            return Action.fetchSubmissionProblemSuccess({ submissions: submissions })
        }),
        catchError(error => of(Action.fetchSubmissionProblemFailure({ error: error.message })))));

    fetchSubmissionDetail$ = createEffect(() => this.action$.pipe(
        ofType(Action.fetchSubmissionDetail),
        switchMap((action) => {
            const REFERENCE = doc(this.db, "submissions", action.submissionId);
            return from(getDoc(REFERENCE));
        }),
        map(res => {
            return Action.fetchSubmissionDetailSuccess({ submission: <Submission>res.data() })
        }),
        catchError(error => of(Action.fetchSubmissionDetailFailure({ error: error.message })))));

}