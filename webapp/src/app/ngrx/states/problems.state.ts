import { Problem } from "src/models/problem.model";

export interface ProblemState {
    problems: Problem[];
    problem?: Problem;
    isLoading: boolean;
    error: string;
}