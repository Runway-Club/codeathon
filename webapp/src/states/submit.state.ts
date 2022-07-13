import { Submission } from "src/models/submission";

export interface SubmitState {
    isSubmitting: boolean;
    error: string;
    mySubmission: Submission[];
}