export interface Testcase {
    input: string;
    output: string;
    timeLimit: number;
    memoryLimit: number;
    score: number;
    allowViewOnFailed: boolean;
}