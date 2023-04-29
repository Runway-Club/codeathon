import { createAction, props } from "@ngrx/store";
import { Problem } from "src/models/problem.model";
import { DocumentSnapshot } from "@angular/fire/firestore";

export const ManageActions = {
    createProblem: createAction('[Manage] Create Problem', props<{ problem: Problem }>()),
    createProblemSuccess: createAction('[Manage] Create Problem Success'),
    updateProblem: createAction('[Manage] Update Problem', props<{ problem: Problem }>()),

    getProblem: createAction('[Manage] Get Problem', props<{ id: string }>()),
    getProblems: createAction('[Manage] Get Problems', props<{ previousDocument: DocumentSnapshot | undefined }>()),
    

    getProblemSuccess: createAction('[Manage] Get Problem Success', props<{ problem: Problem }>()),
    getProblemsSuccess: createAction('[Manage] Get Problems Success', props<{ problems: Problem[] }>()),

}