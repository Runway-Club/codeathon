import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, limit, query, setDoc, startAt, where } from "@angular/fire/firestore";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { from, switchMap, map, catchError, of } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { Problem } from "src/models/problem.model";
import {
    createProblem, createProblemSuccess, createProblemFailure,
    updateProblem, updateProblemFailure, updateProblemSuccess,
    getProblem, getProblemSuccess, getProblemFailure,
    deleteProblem, deleteProblemSuccess, deleteProblemFailure,
    resetSubmissions, resetSubmissionsSuccess, resetSubmissionsFailure,
    listingProblem, listingProblemSuccess, listingProblemFailure,
    searchProblem, searchProblemSuccess, searchProblemFailure
} from "../actions/problem.action";

@Injectable()
export class ProblemEffects {
    constructor(private db: Firestore, private action$: Actions, private http: HttpClient) { }

    createProblem$ = createEffect(() => this.action$.pipe(
        ofType(createProblem),
        switchMap(action => {
            // console.log(action);
            return from(addDoc(collection(this.db, 'problems'), action.problem))
        }),
        map(() => createProblemSuccess()),
        catchError(error => of(createProblemFailure({ error: error.message })))));

    updateProblem$ = createEffect(() => this.action$.pipe(
        ofType(updateProblem),
        switchMap(action => setDoc(doc(this.db, 'problems', action.id), action.problem)),
        map(() => updateProblemSuccess()),
        catchError(error => of(updateProblemFailure({ error: error.message })))));

    getProblem$ = createEffect(() => this.action$.pipe(
        ofType(getProblem),
        switchMap(action => {
            // console.log(action);
            return from(getDoc(doc(this.db, 'problems', action.id)))
        }),
        map(action => action.data()),
        map(data => {
            console.log(<Problem>data);
            if (data == undefined) {
                return getProblemFailure({ error: "Problem not found" });
            }
            return getProblemSuccess({ problem: <Problem>data });
        }),
        catchError(error => of(getProblemFailure({ error: error.message })))));

    deleteProblem$ = createEffect(() => this.action$.pipe(
        ofType(deleteProblem),
        switchMap(action => deleteDoc(doc(this.db, 'problems', action.id))),
        map(() => deleteProblemSuccess()),
        catchError(error => of(deleteProblemFailure({ error: error.message })))));

    resetSubmissions$ = createEffect(() => this.action$.pipe(
        ofType(resetSubmissions),
        switchMap(action => {
            let q = query(collection(this.db, 'submissions'),
                where('problemId', '==', action.id));
            return getDocs(q);
        }),
        map((snapshot) => {
            let promises = [];
            for (let d of snapshot.docs) {
                promises.push(deleteDoc(doc(this.db, 'submissions', d.id)));
            }
            return Promise.all(promises);
        }),
        map(() => resetSubmissionsSuccess()),
        catchError(error => of(resetSubmissionsFailure({ error: error.message })))));

    listingProblems$ = createEffect(() => this.action$.pipe(
        ofType(listingProblem),
        switchMap(action => {
            console.log("Listing");
            var q;
            if (action.prevDoc == undefined) {
                q = query(collection(this.db, 'problems'), limit(20));
            } else {
                q = query(collection(this.db, 'problems'), startAt(action.prevDoc), limit(20));
            }

            return getDocs(q);
        }),
        map((snapshot) => {
            let problems = [];
            for (let d of snapshot.docs) {
                problems.push({ ...<Problem>d.data(), id: d.id });
            }
            return listingProblemSuccess({ problems: problems });
        }),
        catchError(error => of(listingProblemFailure({ error: error.message })))));

    searchProblems$ = createEffect(() => this.action$.pipe(
        ofType(searchProblem),
        switchMap(action => {

            console.log(`query::::::${action.query}`)
            /**
             * example query data firestore
             */
            var q = query(collection(this.db, 'problems'), where("time_limit", "==", 60));
            return getDocs(q);
        }),
        map((snapshot) => {
            let problems = [];

            for (let d of snapshot.docs) {
                problems.push({ ...<Problem>d.data(), id: d.id });
            }

            return searchProblemSuccess({ problems: problems });
        }),
        catchError(error => of(searchProblemFailure({ error: error.message })))));

}