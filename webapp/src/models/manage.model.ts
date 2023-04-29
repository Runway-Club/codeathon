export interface Manage 
{
    id?: string;
    title: string;
    content: string;
    tags: string[];
    difficulty: number;
    status: string;

    time_limit: number;
    memory_limit: number;

    samples: ManageSample[];
    testcases: TestCase[];
    createdAt: number;

    score: number;
}
export interface TestCase 
{
    input: string;
    expected_output: string;

    time_limit: number;
    memory_limit: number;

    score: number;
    allow_view_on_failed: boolean;
}

export interface ManageSample 
{
    input: string;
    output: string;
}