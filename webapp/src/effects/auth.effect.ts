import { Injectable } from "@angular/core";
import { Firestore } from "@angular/fire/firestore";
import { Actions, ofType } from "@ngrx/effects";
import { fetchAuth, login, loginFailure, loginSuccess, logout, logoutFailure, logoutSuccess } from "src/actions/auth.action";
import { catchError, map, of, switchMap } from 'rxjs';
import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { Auth, authState, signOut } from "@angular/fire/auth";
import { AuthState } from "src/states/auth.state";

@Injectable()
export class AuthEffects {
    constructor(private action$: Actions, private db: Firestore, private auth: Auth) { }

    login$ = this.action$.pipe(
        ofType(login),
        switchMap(action => signInWithPopup(this.auth, new GoogleAuthProvider())),
        map(action => loginSuccess({
            auth: {
                uid: action.user.uid,
                email: action.user.email ?? "",
                displayName: action.user.displayName ?? "",
                photoURL: action.user.photoURL ?? "",
                isFailure: false,
                error: "",
                isLoggedIn: true
            }
        })),
        catchError(error => of(loginFailure({ error: error.message }))));

    logout$ = this.action$.pipe(
        ofType(logout),
        switchMap(() => signOut(this.auth)),
        map(() => logoutSuccess()),
        catchError(error => of(logoutFailure({ error: error.message }))));

    fetchAuth$ = this.action$.pipe(
        ofType(fetchAuth),
        switchMap(() => authState(this.auth)),
        map(user => {
            if (user == null) {
                return logoutSuccess();
            }
            return loginSuccess({
                auth: {
                    uid: user.uid,
                    email: user.email ?? "",
                    displayName: user.displayName ?? "",
                    photoURL: user.photoURL ?? "",
                    isFailure: false,
                    error: "",
                    isLoggedIn: true
                }
            });
        }));


}