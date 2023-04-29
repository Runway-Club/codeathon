import { Injectable } from '@angular/core';
import { Problem } from 'src/models/problem.model';
import {
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,

  Firestore,
  collection,
  doc,
  limit,
  query,
  Query,
  startAt,
  where,
  DocumentSnapshot,
  orderBy,
  DocumentData,
  OrderByDirection
} from "@angular/fire/firestore";


@Injectable({
  providedIn: 'root'
})

export class ProblemService {
  constructor(private database: Firestore) { }

  async getProblems(
    previousDocument?: DocumentSnapshot,
    difficulty?: string,
    status?: string,
    sort?: {
      field: string,
      direction: "desc" | "asc"
    }
  ): Promise<Problem[]> {
    const limitation = 20;

    let problems: Problem[] = [];

    let q: Query<DocumentData> = query(
      collection(this.database, 'problems'),
      limit(limitation)
    );

    if (previousDocument) {
      q = query(q, startAt(previousDocument));
    }

    if (difficulty) {
      q = query(q, where('difficulty', "==", difficulty));
    }

    if (status) {
      q = query(q, where('status', "==", status));
    }

    if (sort) {
      const { field, direction } = sort;
      q = query(q, orderBy(field, direction));
    }


    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc: any) => {
      problems.push({
        id: doc.id,
        ...<Problem>doc.data()
      });
    });

    return problems;
  }

  async getProblem(id: string): Promise<Problem> {
    const documentReference = doc(this.database, 'problems', id);
    const documentSnapshot = await getDoc(documentReference);

    return {
      id: documentSnapshot.id,
      ...<Problem>documentSnapshot.data()
    };

  }

  async createProblem(problem: Problem): Promise<string> {
    const documentReference = await addDoc(collection(this.database, 'problems'), problem);
    return documentReference.id;
  }

  async updateProblem(problem: Problem): Promise<void> {
    const documentReference = doc(this.database, 'problems', problem.id!);
    await setDoc(documentReference, problem);
  }

  async deleteProblem(id: string): Promise<void> {
    const documentReference = doc(this.database, 'problems', id);
    await deleteDoc(documentReference);
  }

}
