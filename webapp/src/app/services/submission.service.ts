import { Injectable } from '@angular/core';
import { collectionChanges, limit, query, where, Firestore, collection, Query, collectionSnapshots } from '@angular/fire/firestore';
import { Submission } from 'src/models/submission';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(
    private db: Firestore
  ) { }

  private submissions: Submission[] = [];

  fetchSubmission(problemId: string, userId: string) {
    const QUERY = query(
      collection(this.db, "submissions"),
      where("problem_id", "==", problemId),
      where("user_id", "==", userId),
      where("evaluated", "==", true),
      // orderBy("time", "desc"),
      limit(100),
    );
    return collectionSnapshots(QUERY);
  }

  addSubmission(submission: Submission) {
    return this.submissions.push(submission);
  }

  getSubmission() {
    return this.submissions;
  }
}
