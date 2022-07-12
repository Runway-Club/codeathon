import { createAction, props } from "@ngrx/store";
import { ProgrammingLanguage } from "src/models/info.model";

export const fetchProgrammingLanguages = createAction('[Info] Fetch Programming Languages');
export const fetchProgrammingLanguagesSuccess = createAction('[Info] Fetch Programming Languages Success', props<{ programmingLanguages: ProgrammingLanguage[] }>());
export const fetchProgrammingLanguagesFailure = createAction('[Info] Fetch Programming Languages Failure', props<{ error: string }>());