import { Problem } from 'src/models/problem.model';

export interface ProblemCreation {
  success: boolean;
  error: string;
}

export interface ProblemUpdation {
  success: boolean;
  error: string;
  problem?: Problem;
}

export interface ProblemRetrieval {
  success: boolean;
  error: string;
  problem?: Problem;
}

export interface ProblemDeletion {
  success: boolean;
  error: string;
}

export interface ProblemResetSubmissions {
  success: boolean;
  error: string;
}

export interface ProblemListing {
  list: Problem[];
  isLoading: boolean;
  error: string;
  success: boolean;
}

export interface GetProblemListing {
  list: Problem[];
  isLoading: boolean;
  error: string;
  success: boolean;
  query: string;
}

export interface GetProblemUser {
  list: Problem[];
  isLoading: boolean;
  error: string;
  success: boolean;
}
