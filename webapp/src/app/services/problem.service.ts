import { Injectable } from '@angular/core';
import { Problem, ProblemSetPagination, Sort, TestCase } from 'src/models/problem.model';
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

  async getProblems(paginate?: ProblemSetPagination, sort?: Sort): Promise<Problem[]> {
    let problems: Problem[] = [];
    let response = await <any>lastValueFrom(
      this.httpClient.get(`${this.api}/problem/?sort=${sort?.field}&order=${sort?.direction}&page=${paginate?.page === undefined ? 1 : paginate.page}&limit=${paginate?.limit === undefined ? 10 : paginate.limit}`));

    for (let problem of response) {
      problems.push(<Problem>problem);
    }

    return problems;
  }

  async getProblem(id: string): Promise<Problem> {
    let response = await <any>lastValueFrom(this.httpClient.get(this.api + '/problem/' + id));
    let problem = <Problem>response;

    console.log(problem)

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

  async getTotalProblems(): Promise<number> {
    let response = await <any>lastValueFrom(this.httpClient.get(this.api + '/problem/count'));
    let totalProblems = <number>response;

    return totalProblems;
  }


}

