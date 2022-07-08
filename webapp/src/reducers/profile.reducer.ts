import { createReducer, on } from "@ngrx/store";
import { UserProfileState } from "src/states/profile.state";
import * as action from '../actions/profile.action';

export const profileReducer = createReducer(<UserProfileState>{},
    on(action.createProfile, state => state),
    on(action.createProfileSuccess, (state, { profile }) => {
        return {
            ...state,
            profile: profile,
            fetched: true,
            error: ''
        };
    }),
    on(action.createProfileFailure, (state, { error }) => {
        return {
            ...state,
            profile: undefined,
            fetched: false,
            error: error
        };
    }),
    on(action.fetchProfile, state => state),
    on(action.fetchProfileSuccess, (state, { profile }) => {
        return {
            ...state,
            profile: profile,
            fetched: true,
            error: ''
        };
    }),
    on(action.fetchProfileFailure, (state, { error }) => {
        return {
            ...state,
            profile: undefined,
            fetched: false,
            error: error
        };
    })
);