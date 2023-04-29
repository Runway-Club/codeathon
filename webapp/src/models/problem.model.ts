
export interface Problem {
    id?: string;
    title: string;
    description: string;
    content: string;
    tags: string[];
    difficulty: string;

    time_limit: number;
    memory_limit: number;

    samples: ProblemSample[];
    testcases: TestCase[];
    createdAt: number;
}

export interface TestCase {
    input: string;
    expected_output: string;

    time_limit: number;
    memory_limit: number;

    score: number;
    allow_view_on_failed: boolean;
}

export interface ProblemSample {
    input: string;
    output: string;
}