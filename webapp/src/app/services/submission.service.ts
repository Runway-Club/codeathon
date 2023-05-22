import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  limit,
  query,
  where,
  Firestore,
  collection,
  getDoc,
  getDocs,
  orderBy,
  doc
} from '@angular/fire/firestore';
import { Observable, lastValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Submission, TestCaseResult } from 'src/models/submission';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  constructor(
    private db: Firestore,
    private http: HttpClient
  ) { }

  async getSubmissions(problemId: string, userId: string): Promise<Submission[]> {
    let tempAPI = environment.api + '/submission/?problem_id=' + problemId + '&uid=' + userId;


    let res = <any>lastValueFrom(this.http.get(tempAPI))

    let submissions = <Submission[]>res;

    return submissions;
  }

  async getSubmission(id: string): Promise<Submission> {
    const documentReference = doc(this.db, 'submissions', id);
    const documentSnapshot = await getDoc(documentReference);

    return documentSnapshot.data() as Submission;
  }

  async createSubmission(submission: Submission): Promise<any> {
    return lastValueFrom(
      this.http.post(environment.api + '/submission/', submission, { observe: "response" })
    )
      .then((res) => {
        console.log()
        if (res.status == 200)
          return submission;
        return null;
      })
  }
}
