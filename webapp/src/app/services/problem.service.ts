import { Injectable } from '@angular/core';
import { Problem, ProblemSetFilter, ProblemSetPagination, Sort, TestCase } from 'src/models/problem.model';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ProblemService {
  constructor(
    private httpClient: HttpClient
  ) { }

  api = environment.api;

  async getProblems(paginate?: ProblemSetPagination, sort?: Sort, filter?: ProblemSetFilter): Promise<Problem[]> {
    let problems: Problem[] = [];
    let tempAPI = this.api + '/problem/?';

    if (paginate) {
      tempAPI += `page=${paginate?.page === undefined ? 1 : paginate.page}&limit=${paginate?.limit === undefined ? 10 : paginate.limit}`;
    }

    if (sort) {
      tempAPI += `&sort=${sort?.field}&order=${sort?.direction}`;
    }

    if (filter) {
      tempAPI += `&status=${filter?.status}&difficulty=${filter?.difficulty}`;
    }

    let response = await <any>lastValueFrom(
      this.httpClient.get(tempAPI));

    for (let problem of response) {
      problems.push(<Problem>problem);
    }

    return problems;
  }

  async getProblem(id: string): Promise<Problem> {
    let response = await <any>lastValueFrom(this.httpClient.get(this.api + '/problem/' + id));
    let problem = <Problem>response;

    return problem;
  }

  // async createProblem(problem: Problem): Promise<string> {
  //   const documentReference = await addDoc(collection(this.database, 'problems'), problem);
  //   return documentReference.id;
  // }

  // async updateProblem(problem: Problem): Promise<void> {
  //   const documentReference = doc(this.database, 'problems', problem.id!);
  //   await setDoc(documentReference, problem);
  // }

  // async deleteProblem(id: string): Promise<void> {
  //   const documentReference = doc(this.database, 'problems', id);
  //   await deleteDoc(documentReference);
  // }

  async getSamples(id: string): Promise<TestCase[]> {
    let response = await <any>lastValueFrom(this.httpClient.get(this.api + '/testcase/sample?problem=' + id));
    let samples = <TestCase[]>response;

    return samples;
  }

  async getTotalProblems(filter?: ProblemSetFilter): Promise<number> {
    let tempAPI = this.api + '/problem/count?';

    if (filter) {
      tempAPI += `status=${filter.status}&difficulty=${filter.difficulty}`;
    }

    let response = await <any>lastValueFrom(this.httpClient.get(tempAPI));
    let totalProblems = <number>response;

    return totalProblems;
  }

  async getProblemSuggestions(text: string): Promise<string[]> {
    if (text.length === 0) {
      return [];
    }

    let response = await <any>lastValueFrom(this.httpClient.get(this.api + '/problem/suggest?q=' + text));
    let suggestions = <string[]>response;

    return suggestions;
  }

}

