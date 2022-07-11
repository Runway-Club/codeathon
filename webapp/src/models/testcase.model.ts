export interface Testcase {
    input: string;
    expected_output: string;
    timeLimit: number;
    memoryLimit: number;
    score: number;
    allowViewOnFailed: boolean;
}