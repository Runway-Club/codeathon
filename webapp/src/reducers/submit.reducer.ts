import { createReducer, on } from "@ngrx/store";
import { exEcutionSubmitState, SubmitState, SubmissionProblemState } from "src/states/submit.state";
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

let initSubmissionProblem: SubmissionProblemState = {
    idProblem: "",
    error: "",
    isSubmissionProblem: false,
    submissions: []
};

export const SubmissionProblemReducer = createReducer(
    initSubmissionProblem,
    on(Action.fetchSubmissionProblem, (state, { problemId }) => (
        {
            ...state,
            idProblem: problemId,
            error: "",
            isSubmissionProblem: false,
            submissions: []
        })),
    on(Action.fetchSubmissionProblemSuccess, (state, { submissions }) => (
        {
            ...state,
            error: "",
            isSubmissionProblem: true,
            submissions: submissions,
            idProblem: ""
        })),
    on(Action.fetchSubmissionProblemFailure, (state, { error }) => (
        {
            ...state,
            error: error,
            isSubmissionProblem: false,
            submissions: [],
            idProblem: ""
        })),
)

