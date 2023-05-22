import { createReducer, on } from '@ngrx/store';

import { SubmissionActions } from '../actions/submission.action';
import { SubmissionState } from '../states/submission.state';

export const initialState: SubmissionState =
{
    submissions: [],
    submission: undefined,
    isLoading: false,
    error: ''
};

export const SubmissionReducer = createReducer(

    initialState,
    on(SubmissionActions.getSubmissions, state => ({ ...state, isLoading: true })),
    on(SubmissionActions.getSubmissionsSuccess, (state, { submissions }) => ({ ...state, submissions, isLoading: false })),
    on(SubmissionActions.getSubmissionsFailure, (state, { error }) => ({ ...state, error, isLoading: false })),

    on(SubmissionActions.getSubmission, state => ({ ...state, isLoading: true })),
    on(SubmissionActions.getSubmissionSuccess, (state, { submission }) => ({ ...state, Submission: submission, isLoading: false })),
    on(SubmissionActions.getSubmissionFailure, (state, { error }) => ({ ...state, error, isLoading: false })),

    on(SubmissionActions.createSubmission, state => ({ ...state, isLoading: true })),
    on(SubmissionActions.createSubmissionSuccess, (state, { submission }) => ({ ...state, submission, submissions: [submission, ...state.submissions.slice(0, 4)], isLoading: false })),
    on(SubmissionActions.createSubmissionFailure, (state, { error }) => ({ ...state, error, isLoading: false })),

);