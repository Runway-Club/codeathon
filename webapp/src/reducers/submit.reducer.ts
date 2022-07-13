import { createReducer, on } from "@ngrx/store";
import { exEcutionSubmitState, SubmitState } from "src/states/submit.state";
import * as Action from '../actions/submit.action';

let initialState: SubmitState = {
    isSubmitting: false,
    error: '',
    mySubmission: [],
    isSubmitted: false
}

export const submitReducer = createReducer(initialState,
    on(Action.submit, state => ({ ...state, isSubmitting: true, error: '' })),
    on(Action.submitSuccess, state => ({ ...state, isSubmitting: false, error: '', isSubmitted: true })),
    on(Action.submitFailure, (state, action) => ({ ...state, isSubmitting: false, error: action.error, isSubmitted: true })),
    on(Action.fetchSubmissions, state => ({ ...state, mySubmission: [] })),
    on(Action.fetchSubmissionsSuccess, (state, action) => ({ ...state, mySubmission: action.submissions })),
    on(Action.fetchSubmissionsFailure, (state, action) => ({ ...state, mySubmission: [], error: action.error })));

let initExEcution: exEcutionSubmitState = {
    id: "",
    error: "",
    isExEcution: false
}

export const exEcutionReducer = createReducer(
    initExEcution,
    on(Action.exEcution, (state, { idSubmissions }) => ({ ...state, id: idSubmissions, error: "", isExEcution: false })),
    on(Action.exEcutionSuccess, (state) => ({ ...state, error: "", isExEcution: true, id: "" })),
    on(Action.exEcutionFailure, (state, { error }) => ({ ...state, error: error, isExEcution: false, id: "" })),
)