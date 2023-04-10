import { Submission } from "src/models/submission";

export interface SubmissionState {
    submissions: Submission[];
    submission?: Submission;
    isLoading: boolean;
    error: string;
}