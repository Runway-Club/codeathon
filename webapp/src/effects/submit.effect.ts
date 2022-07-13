import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { docSnapshots, Firestore, getDocs, limit, orderBy } from "@angular/fire/firestore";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map, catchError, of, from } from "rxjs";
import { environment } from "src/environments/environment";
import { Submission } from "src/models/submission";
import * as Action from '../actions/submit.action';

@Injectable()
export class SubmitEffects {
    constructor(private action$: Actions, private http: HttpClient, private db: Firestore) { }

    submit$ = createEffect(() => this.action$.pipe(
        ofType(Action.submit),
        switchMap(action => {
            console.log(action.submission);
            return this.http.post(environment.api + '/execution/', action.submission)
        }),
        map(res => Action.submitSuccess()),
        catchError(error => of(Action.submitFailure({ error: error.message })))));

    fetchMySubmissions$ = createEffect(() => this.action$.pipe(
        ofType(Action.fetchSubmissions),
        switchMap((action) => {
            let q = query(collection(this.db, "submissions"),
                where("submission_id", "==", action.submissionId),
                where("user_id", "==", action.userId),
                where("evaluated", "==", true),
                orderBy("time", "desc"),
                limit(100)
            );
            return from(getDocs(q));
        }),
        map(res => {
            let submissions: Submission[] = [];
            for (let i = 0; i < res.docs.length; i++) {
                submissions.push(res.docs[i].data() as Submission);
            }
            return Action.fetchSubmissionsSuccess({ submissions: submissions })
        }),
        catchError(error => of(Action.fetchSubmissionsFailure({ error: error.message })))));


}