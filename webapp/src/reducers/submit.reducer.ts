import { createReducer, on } from "@ngrx/store";
import { Submission } from "src/models/submission";
import { exEcutionSubmitState, SubmitState, SubmissionProblemState, SubmissionDetailState } from "src/states/submit.state";
import * as Action from '../actions/submit.action';

let initialState: SubmitState = {
    isSubmitting: false,
    error: '',
    mySubmission: [],
    isSubmitted: false
}

export const submitReducer = createReducer(initialState,
    on(Action.submit, state => ({ ...state, isSubmitting: true, error: '', isSubmitted: false })),
    on(Action.submitSuccess, state => ({ ...state, isSubmitting: false, error: '', isSubmitted: true })),
    on(Action.submitFailure, (state, action) => ({ ...state, isSubmitting: false, error: action.error, isSubmitted: false })),
    on(Action.fetchSubmissions, state => ({ ...state, mySubmission: [], isSubmitted: false })),
    on(Action.fetchSubmissionsSuccess, (state, action) => ({ ...state, mySubmission: action.submissions, isSubmitted: false })),
    on(Action.fetchSubmissionsFailure, (state, action) => ({ ...state, mySubmission: [], error: action.error, isSubmitted: false })));

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

let initSubmissionDetail: SubmissionDetailState = {
    idSubmission: "",
    error: "",
    isSubmissionDetail: false,
    submission: <Submission>{}
};



export const SubmissionDetailReducer = createReducer(
    initSubmissionDetail,
    on(Action.fetchSubmissionDetail, (state, action) => {
        return {
            ...state,
            idSubmission: action.submissionId,
            error: "",
            isSubmissionDetail: false,
            submission: <Submission>{}
        }
    }),
    on(Action.fetchSubmissionDetailSuccess, (state, action) => {
        return {
            ...state,
            error: "",
            isSubmissionDetail: true,
            submission: action.submission,
            idSubmission: ""
        }
    }),
    on(Action.fetchSubmissionDetailFailure, (state, action) => {
        return {
            ...state,
            error: action.error,
            isSubmissionDetail: false,
            submission: <Submission>{},
            idSubmission: ""
        }
    }),
)


