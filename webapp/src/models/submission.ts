export interface Submission {
    id?: string;
    problem_id: string;
    language_id: number;
    code: string;
    uid: string;
    evaluated: boolean;

    score: number;
    result: string;

    total_memory: number;
    total_time: number;
    total_score: number;
    createAt: number
}

export interface TestCaseResult {
    ExpectedOutput: string,
    Input: string,
    Message: string,
    Output: string,
    Stderr: string
}