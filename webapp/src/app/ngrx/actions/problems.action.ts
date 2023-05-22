import { createAction, props } from "@ngrx/store"
import { Problem, Sort, ProblemSetPagination, ProblemSetFilter } from "src/models/problem.model"

export const ProblemActions = {
    getProblems: createAction('[Problem] Get Problems', props<{ paginate?: ProblemSetPagination, sort?: Sort, filter?: ProblemSetFilter }>()),
    getProblemsSuccess: createAction('[Problem] Get Problems Success', props<{ problems: Problem[] }>()),
    getProblemsFailure: createAction('[Problem] Get Problems Failure', props<{ error: string }>()),

    getProblem: createAction('[Problem] Get Problem', props<{ id: string }>()),
    getProblemSuccess: createAction('[Problem] Get Problem Success', props<{ problem: Problem }>()),
    getProblemFailure: createAction('[Problem] Get Problem Failure', props<{ error: string }>()),

    createProblem: createAction('[Problem] Create Problem', props<{ problem: Problem }>()),
    createProblemSuccess: createAction('[Problem] Create Problem Success'),
    createProblemFailure: createAction('[Problem] Create Problem Failure', props<{ error: string }>()),

    updateProblem: createAction('[Problem] Update Problem', props<{ problem: Problem }>()),
    updateProblemSuccess: createAction('[Problem] Update Problem Success'),
    updateProblemFailure: createAction('[Problem] Update Problem Failure', props<{ error: string }>()),

    deleteProblem: createAction('[Problem] Delete Problem', props<{ id: string }>()),
    deleteProblemSuccess: createAction('[Problem] Delete Problem Success'),
    deleteProblemFailure: createAction('[Problem] Delete Problem Failure', props<{ error: string }>()),
}