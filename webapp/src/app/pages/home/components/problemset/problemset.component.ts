import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Problem } from 'src/models/problem.model';

import { ProblemActions } from 'src/app/ngrx/actions/problems.action';
import { ProblemState } from 'src/app/ngrx/states/problems.state';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { map } from 'rxjs';

@Component({
  selector: 'app-problemset',
  templateUrl: './problemset.component.html',
  styleUrls: ['./problemset.component.scss']
})
export class ProblemsetComponent implements OnInit {
  constructor(
    private store: Store<{ problem: ProblemState }>,
    private router: Router
  ) { }

  selectedDifficulty: string = 'All';
  selectedStatus: string = 'All';

  problems$ = this.store.select('problem').pipe(map((problemState) => problemState.problems))
  loading$ = this.store.select('problem').pipe(map((problemState) => problemState.isLoading))
  previousDocument: DocumentSnapshot | undefined = undefined;

  ngOnInit(): void {
    this.store.dispatch(ProblemActions.getProblems({ previousDocument: this.previousDocument }));
  }

  viewProblem(problem: Problem) {
    // console.log(problem);
    this.router.navigate(['/problem', problem.id]);
  }

}
