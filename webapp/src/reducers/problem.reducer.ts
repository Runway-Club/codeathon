import { createReducer, on } from "@ngrx/store";
import { ProblemCreation, ProblemDeletion, ProblemListing, ProblemResetSubmissions, ProblemRetrieval, ProblemUpdation } from "src/states/problem.state";
import {
    createProblem, createProblemFailure, createProblemSuccess,
    updateProblem, updateProblemFailure, updateProblemSuccess,
    getProblem, getProblemSuccess, getProblemFailure,
    deleteProblem, deleteProblemFailure, deleteProblemSuccess,
    resetSubmissions, resetSubmissionsFailure, resetSubmissionsSuccess, listingProblem, listingProblemSuccess, listingProblemFailure, searchProblem, searchProblemSuccess, searchProblemFailure
} from '../actions/problem.action';
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

export const problemUpdationReducer = createReducer(<ProblemUpdation>{},
    on(updateProblem, state => state),
    on(updateProblemSuccess, state => {
        return {
            ...state,
            success: true,
            error: '',
        };
    }),
    on(updateProblemFailure, (state, { error }) => {
        return {
            ...state,
            success: false,
            error: error
        };
    }));

export const problemRetrievalReducer = createReducer(<ProblemRetrieval>{
    success: false,
    error: '',
    problem: undefined
},
    on(getProblem, state => state),
    on(getProblemSuccess, (state, { problem }) => {
        return {
            ...state,
            success: true,
            error: '',
            problem: problem
        };
    }
    ),
    on(getProblemFailure, (state, { error }) => {
        return {
            ...state,
            success: false,
            error: error
        };
    }));

export const deleteProblemReducer = createReducer(<ProblemDeletion>{},
    on(deleteProblem, state => state),
    on(deleteProblemSuccess, state => {
        return {
            ...state,
            success: true,
            error: ''
        };
    }),
    on(deleteProblemFailure, (state, { error }) => {
        return {
            ...state,
            success: false,
            error: error
        };
    })
);

export const resetSubmissionsReducer = createReducer(<ProblemResetSubmissions>{},
    on(resetSubmissions, state => state),
    on(resetSubmissionsSuccess, state => {
        return {
            ...state,
            success: true,
            error: ''
        };
    }
    ),
    on(resetSubmissionsFailure, (state, { error }) => {
        return {
            ...state,
            success: false,
            error: error
        };
    }
    )
);

export const listingProblemReducer = createReducer(<ProblemListing>{},
    on(listingProblem, state => {
        return {
            ...state,
            isLoading: true,
            success: false,
            error: '',
            list: []
        };
    }),
    on(listingProblemSuccess, (state, { problems }) => {
        return {
            ...state,
            isLoading: false,
            success: true,
            error: '',
            list: problems
        };
    }),
    on(listingProblemFailure, (state, { error }) => {
        return {
            ...state,
            isLoading: false,
            success: false,
            error: error,
            list: []
        };
    }),
    on(searchProblem, (state) => {
        return {
            ...state,
            isLoading: true,
            success: false,
            error: '',
            list: []
        };
    }),
    on(searchProblemSuccess, (state, { problems }) => {
        return {
            ...state,
            isLoading: false,
            success: true,
            error: '',
            list: problems
        };
    }),
    on(searchProblemFailure, (state, { error }) => {
        return {
            ...state,
            isLoading: false,
            success: false,
            error: error,
            list: []
        };
    }));