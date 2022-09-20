import { Submission } from "src/models/submission";

export interface SubmitState {
    isSubmitting: boolean;
    error: string;
    mySubmission: Submission[];
    isSubmitted: boolean;
}

export interface exEcutionSubmitState {
    id: string,
    isExEcution: boolean;
    error: string;
}

export interface SubmissionProblemState {
    idProblem: string,
    isSubmissionProblem: boolean;
    error: string;
    submissions: Submission[];
}