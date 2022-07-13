import { Testcase } from "./testcase.model";

export interface Submission {
    language_id: number;
    problem_id: string;
    code: string;
    source: string;
    user_id: string;
    evaluated: boolean;
    score: number;
    testcases: any[];
    total_memory: number;
    total_time: number;
    total_score: number;
}