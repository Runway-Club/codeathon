export interface Testcase {
    input: string;
    expected_output: string;
    time_limit: number;
    memory_limit: number;
    score: number;
    allow_view_on_failed: boolean;
}