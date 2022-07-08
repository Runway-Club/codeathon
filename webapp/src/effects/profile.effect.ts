import { Injectable } from "@angular/core";
import { collection, doc, Firestore, getDoc, setDoc } from "@angular/fire/firestore";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as action from '../actions/profile.action';
import { switchMap, map, from, catchError, of } from "rxjs";
import { UserProfile } from "src/models/profile.model";
@Injectable()
export class ProfileEffects {
    constructor(private action$: Actions, private db: Firestore) { }

    fetchProfile$ = createEffect(() => this.action$.pipe(
        ofType(action.fetchProfile),
        switchMap(action => getDoc(doc(this.db, `profiles/${action.id}`))),
        map(action => action.data()),
        map(data => {
            if (data == undefined) {
                return action.fetchProfileFailure({ error: "Profile not found" });
            }
            return action.fetchProfileSuccess({ profile: <UserProfile>data });
        }),
        catchError(error => of(action.fetchProfileFailure({ error: error.message })))));

    createProfile$ = createEffect(() => this.action$.pipe(
        ofType(action.createProfile),
        switchMap(action => from(setDoc(doc(this.db, `profiles/${action.id}`), <UserProfile>{ role: 'basic' }))),
        map(() => action.createProfileSuccess({ profile: <UserProfile>{ role: 'basic' } })),
        catchError(error => of(action.createProfileFailure({ error: error.message })))));


}