export interface Submission {
    id?: string;
    problem_id: string;
    language_id: number;
    code: string;
    source: string;
    user_id: string;

    evaluated: boolean;
    score: number;
    testcases?: TestCaseResult[];

    total_memory: number;
    total_time: number;
    total_score: number;
    time: number
}

export interface TestCaseResult {
    ExpectedOutput: string,
    Input: string,
    Message: string,
    Output: string,
    Stderr: string
}