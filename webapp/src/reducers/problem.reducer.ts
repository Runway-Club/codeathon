import { createReducer, on } from "@ngrx/store";
import { ProblemCreation } from "src/states/problem.state";
import { createProblem, createProblemFailure, createProblemSuccess } from '../actions/problem.action';
export const problemCreationReducer = createReducer(<ProblemCreation>{},
    on(createProblem, state => state),
    on(createProblemSuccess, state => {
        return {
            ...state,
            success: true,
            error: ''
        };
    }),
    on(createProblemFailure, (state, { error }) => {
        return {
            ...state,
            success: false,
            error: error
        };
    }));