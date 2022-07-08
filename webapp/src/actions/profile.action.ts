import { createAction, props } from "@ngrx/store";
import { UserProfile } from "src/models/profile.model";

export const createProfile = createAction('[Profile] Create', props<{ id: string }>());
export const createProfileSuccess = createAction('[Profile] Create Success', props<{ profile: UserProfile }>());
export const createProfileFailure = createAction('[Profile] Create Failure', props<{ error: string }>());

export const fetchProfile = createAction('[Profile] Fetch', props<{ id: string }>());
export const fetchProfileSuccess = createAction('[Profile] Fetch Success', props<{ profile: UserProfile }>());
export const fetchProfileFailure = createAction('[Profile] Fetch Failure', props<{ error: string }>());