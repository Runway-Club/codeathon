import { ProblemSample } from "./sample.model";
import { Testcase } from "./testcase.model";

export interface Problem {
    title: string;
    description: string;
    content: string;
    tags: string[];
    difficulty: number;
    timeLimit: number;
    memoryLimit: number;
    samples: ProblemSample[];
    testcases: Testcase[];
    createdAt: number;
}