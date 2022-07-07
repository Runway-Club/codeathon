import { Injectable } from "@angular/core";
import { Firestore } from "@angular/fire/firestore/firebase";
import { Actions, ofType } from "@ngrx/effects";
import { fetchAuth, login, loginFailure, loginSuccess, logout, logoutFailure, logoutSuccess } from "src/actions/auth.action";
import { catchError, map, of, switchMap } from 'rxjs';
import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { Auth, authState, signOut } from "@angular/fire/auth";

@Injectable()
export class AuthEffects {
    constructor(private action$: Actions, private db: Firestore, private auth: Auth) { }

    login$ = this.action$.pipe(
        ofType(login),
        switchMap(action => signInWithPopup(this.auth, new GoogleAuthProvider())),
        map(action => loginSuccess({ auth: action.user })),
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
            return loginSuccess({ auth: user });
        }));


}