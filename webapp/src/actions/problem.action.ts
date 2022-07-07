import { createAction, props } from "@ngrx/store";
import { Problem } from "src/models/problem.model";


export const createProblem = createAction("[Problem] Create Problem", props<{ problem: Problem }>());
export const createProblemSuccess = createAction("[Problem] Create Problem Success");
export const createProblemFailure = createAction("[Problem] Create Problem Failure", props<{ error: string }>());