import { Testcase } from "./testcase.model";

export interface Submission {
    language_id: number;
    problem_id: string;
    code: string;
    source: string;
    user_id: string;
    evaluated: boolean;
    score: number;
    testcases?: TestCase[];
    total_memory: number;
    total_time: number;
    total_score: number;
    time: number
}

export interface TestCase {
    ExpectedOutput: string,
    Input: string,
    Message: string,
    Output: string,
    Stderr: string
}