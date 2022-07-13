import { createReducer, on } from "@ngrx/store";
import { SubmitState } from "src/states/submit.state";
import * as Action from '../actions/submit.action';

let initialState: SubmitState = {
    isSubmitting: false,
    error: '',
    mySubmission: [],
}

export const submitReducer = createReducer(initialState,
    on(Action.submit, state => ({ ...state, isSubmitting: true, error: '' })),
    on(Action.submitSuccess, state => ({ ...state, isSubmitting: false, error: '' })),
    on(Action.submitFailure, (state, action) => ({ ...state, isSubmitting: false, error: action.error })),
    on(Action.fetchSubmissions, state => ({ ...state, mySubmission: [] })),
    on(Action.fetchSubmissionsSuccess, (state, action) => ({ ...state, mySubmission: action.submissions })),
    on(Action.fetchSubmissionsFailure, (state, action) => ({ ...state, mySubmission: [], error: action.error })));