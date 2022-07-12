import { createReducer, on } from "@ngrx/store";
import { InfoState } from "src/states/info.state";
import * as Action from '../actions/info.action';
export const initialState: InfoState = {
    info: {
        programmingLanguages: [],
    },
    fetched: false,
    error: '',
};

export const infoReducer = createReducer(initialState,
    on(Action.fetchProgrammingLanguages, state => ({ ...state, fetched: false, error: '' })),
    on(Action.fetchProgrammingLanguagesSuccess, (state, action) => ({ ...state, info: { ...state.info, programmingLanguages: action.programmingLanguages }, fetched: true })),
    on(Action.fetchProgrammingLanguagesFailure, (state, action) => ({ ...state, error: action.error, fetched: false })));