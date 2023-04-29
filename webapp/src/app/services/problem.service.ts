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
  startAt,
  where,
  DocumentSnapshot
} from "@angular/fire/firestore";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ProblemService {
  constructor(private database: Firestore) { }

  async getProblems(previousDocument: DocumentSnapshot | undefined): Promise<Problem[]> {
    let problems: Problem[] = [];
    let q: any;

    if (previousDocument == undefined) {
      q = query(collection(this.database, 'problems'), limit(20));
    } else {
      q = query(collection(this.database, 'problems'), startAt(previousDocument), limit(20));
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

  async getProblem(id: string): Promise<Problem> 
  {
    const documentReference = doc(this.database, 'problems', id);
    const documentSnapshot = await getDoc(documentReference);

    return {
      id: documentSnapshot.id,
      ...<Problem>documentSnapshot.data()
    };
  }

  async createProblem(problem: Problem): Promise<string> 
  {
    const documentReference = await addDoc(collection(this.database, 'problems'), problem);
    return documentReference.id;
  }

  async updateProblem(problem: Problem): Promise<void> 
  {
    const documentReference = doc(this.database, 'problems', problem.id!);
    await setDoc(documentReference, problem);
  }

  async deleteProblem(id: string): Promise<void> 
  {
    const documentReference = doc(this.database, 'problems', id);
    await deleteDoc(documentReference);
  }

}
