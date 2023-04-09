import { createReducer, on } from '@ngrx/store';

import { ProblemActions } from '../actions/problems.action';
import { ProblemState } from '../states/problems.state';

export const initialState: ProblemState = {
    problems: [],
    problem: undefined,
    isLoading: false,
    error: ''
};

export const ProblemReducer = createReducer(
    initialState,
    on(ProblemActions.getProblems, state => ({ ...state, isLoading: true })),
    on(ProblemActions.getProblemsSuccess, (state, { problems }) => ({ ...state, problems, isLoading: false })),
    on(ProblemActions.getProblemsFailure, (state, { error }) => ({ ...state, error, isLoading: false })),

    on(ProblemActions.getProblem, state => ({ ...state, isLoading: true })),
    on(ProblemActions.getProblemSuccess, (state, { problem }) => ({ ...state, problem: problem, isLoading: false })),
    on(ProblemActions.getProblemFailure, (state, { error }) => ({ ...state, error, isLoading: false })),

    on(ProblemActions.createProblem, state => ({ ...state, isLoading: true })),
    on(ProblemActions.createProblemSuccess, (state) => ({ ...state, isLoading: false })),
    on(ProblemActions.createProblemFailure, (state, { error }) => ({ ...state, error, isLoading: false })),

    on(ProblemActions.updateProblem, state => ({ ...state, isLoading: true })),
    on(ProblemActions.updateProblemSuccess, (state) => ({ ...state, isLoading: false })),
    on(ProblemActions.updateProblemFailure, (state, { error }) => ({ ...state, error, isLoading: false })),
);