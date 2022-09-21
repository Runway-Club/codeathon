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
    allow_view_on_failed: boolean,
    expected_output: string,
    input: string,
    memory_limit: number,
    score: number,
    time_limit: number
}