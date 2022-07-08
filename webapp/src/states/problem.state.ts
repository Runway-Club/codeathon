import { Problem } from "src/models/problem.model";

export interface ProblemCreation {
    success: boolean;
    error: string;
}

export interface ProblemUpdation {
    success: boolean;
    error: string;
    problem?: Problem;
}

export interface ProblemRetrieval {
    success: boolean;
    error: string;
    problem?: Problem;
}

export interface ProblemDeletion {
    success: boolean;
    error: string;
}

export interface ProblemResetSubmissions {
    success: boolean;
    error: string;
}