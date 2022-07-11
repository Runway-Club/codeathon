import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map, catchError, of } from "rxjs";
import { environment } from "src/environments/environment";
import { ProgrammingLanguage } from "src/models/info.model";
import { fetchProgrammingLanguages, fetchProgrammingLanguagesFailure, fetchProgrammingLanguagesSuccess } from "../actions/info.action";
@Injectable()
export class InfoEffects {
    constructor(private action$: Actions, private http: HttpClient) { }

    fetchInfo$ = createEffect(() => this.action$.pipe(
        ofType(fetchProgrammingLanguages),
        switchMap(() => this.http.get(environment.api + '/info/languages/')),
        map(data => fetchProgrammingLanguagesSuccess({ programmingLanguages: <ProgrammingLanguage[]>data })),
        catchError(error => of(fetchProgrammingLanguagesFailure({ error: error.message })))));

}