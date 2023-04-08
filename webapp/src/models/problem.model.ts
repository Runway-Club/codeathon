import { ProblemSample } from './sample.model';
import { Testcase } from './testcase.model';

export interface Problem {
  userId?: string;
  id?: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  difficulty: number;
  time_limit: number;
  memory_limit: number;
  samples: ProblemSample[];
  testcases: Testcase[];
  createdAt: number;
}
