
import { createAction, props } from "@ngrx/store";
import { AuthState } from "src/states/auth.state";

export const login = createAction('[Auth] Login');
export const logout = createAction('[Auth] Logout');
export const loginSuccess = createAction('[Auth] Login Success', props<{ auth: AuthState }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());
export const logoutSuccess = createAction('[Auth] Logout Success',);
export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: string }>());
export const fetchAuth = createAction('[Auth] Fetch Auth');