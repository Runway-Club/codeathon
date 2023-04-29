import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";

import { Problem } from "src/models/problem.model";
import { ProblemActions } from "../actions/problems.action";
import { ProblemService } from "src/app/services/problem.service";

import { of } from "rxjs";
import { map, switchMap, catchError } from "rxjs/operators";

@Injectable()
export class ProblemEffects {
    constructor(
        private actions$: Actions,
        private problemService: ProblemService
    ) { }

    getProblems$ = createEffect(() => this.actions$.pipe(
        ofType(ProblemActions.getProblems),
        switchMap((action) => {
            return this.problemService.getProblems(action.previousDocument, action.difficulty, action.status, action.sort)
        }),
        map((problems: Problem[]) => {
            return ProblemActions.getProblemsSuccess({ problems })
        }),
        catchError((error: string) => {
            return of(ProblemActions.getProblemsFailure({ error }))
        })
    ))

    getProblem$ = createEffect(() => this.actions$.pipe(
        ofType(ProblemActions.getProblem),
        switchMap((action) => {
            return this.problemService.getProblem(action.id)
        }),
        map((problem) => {
            return ProblemActions.getProblemSuccess({ problem })
        }),
        catchError((error: string) => {
            return of(ProblemActions.getProblemFailure({ error }))
        }),
    ))

    createProblem$ = createEffect(() => this.actions$.pipe(
        ofType(ProblemActions.createProblem),
        switchMap((action) => {
            return this.problemService.createProblem(action.problem)
        }),
        map(() => {
            return ProblemActions.createProblemSuccess()
        }),
        catchError((error: string) => {
            return of(ProblemActions.createProblemFailure({ error }))
        })
    ))

    updateProblem$ = createEffect(() => this.actions$.pipe(
        ofType(ProblemActions.updateProblem),
        switchMap((action) => {
            return this.problemService.updateProblem(action.problem)
        }),
        map(() => {
            return ProblemActions.updateProblemSuccess()
        }),
        catchError((error: string) => {
            return of(ProblemActions.updateProblemFailure({ error }))
        })
    ))

    deleteProblem$ = createEffect(() => this.actions$.pipe(
        ofType(ProblemActions.deleteProblem),
        switchMap((action) => {
            return this.problemService.deleteProblem(action.id)
        }),
        map(() => {
            return ProblemActions.deleteProblemSuccess()
        }),
        catchError((error: string) => {
            return of(ProblemActions.deleteProblemFailure({ error }))
        })
    ))

}


