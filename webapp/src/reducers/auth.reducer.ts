import { createReducer, on } from "@ngrx/store";
import { AuthState } from '../states/auth.state';
import { login, logout, loginSuccess, loginFailure, logoutSuccess, logoutFailure, fetchAuth } from '../actions/auth.action';

export const authReducer = createReducer(<AuthState>{},
    on(login, state => state),
    on(fetchAuth, state => state),
    on(loginSuccess, (state, { auth }) => {
        return {
            ...state,
            isLoggedIn: true,
            uid: auth.uid,
            email: auth.email ?? "",
            displayName: auth.displayName ?? "",
            photoURL: auth.photoURL ?? "",
            isFailure: false,
            error: ''
        };
    }),
    on(loginFailure, (state, { error }) => {
        return {
            ...state,
            isLoggedIn: false,
            uid: "",
            email: "",
            displayName: "",
            photoURL: "",
            isFailure: true,
            error: error
        };
    }),
    on(logout, state => state),
    on(logoutSuccess, state => {
        return {
            ...state,
            isLoggedIn: false,
            uid: "",
            email: "",
            displayName: "",
            photoURL: "",
            isFailure: false,
            error: ''
        };
    }),
    on(logoutFailure, (state, { error }) => {
        return {
            ...state,
            isLoggedIn: true,
            uid: "",
            email: "",
            displayName: "",
            photoURL: "",
            isFailure: true,
            error: error
        };
    }));