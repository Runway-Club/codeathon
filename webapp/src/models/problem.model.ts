export interface Problem {
    _id?: string;
    title: string;
    description: string;
    content: string;
    tags: string[];
    difficulty: number;

    time_limit: number;
    memory_limit: number;

    samples: ProblemSample[];
    testcases: TestCase[];
    create_at: number;

    score: number;
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

export type Sort = {
    field: string,
    direction: "desc" | "asc"
}

export type ProblemSetPagination = {
    page: number,
    limit: number,
    totalPages: number
}

export type ProblemSetFilter = {
    status?: string,
    difficulty?: string,
}
