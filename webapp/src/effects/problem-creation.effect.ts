import { Injectable } from "@angular/core";
import { addDoc, collection, doc, Firestore } from "@angular/fire/firestore";
import { Actions, ofType } from "@ngrx/effects";
import { from, switchMap, map, catchError, of } from "rxjs";
import { createProblem, createProblemSuccess, createProblemFailure } from '../actions/problem.action';

@Injectable()
export class ProblemCreationEffects {
    constructor(private db: Firestore, private action$: Actions) { }

    createProblem$ = this.action$.pipe(
        ofType(createProblem),
        switchMap(action => from(addDoc(collection(this.db, 'problems'), action.problem))),
        map(() => createProblemSuccess()),
        catchError(error => of(createProblemFailure({ error: error.message }))));

}