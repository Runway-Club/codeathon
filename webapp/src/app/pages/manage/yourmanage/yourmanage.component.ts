import { Component, OnInit } from '@angular/core';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { ProblemState } from 'src/states/problem.state';
import { Problem } from 'src/models/problem.model';
import { ProblemActions } from 'src/app/ngrx/actions/problems.action';

@Component({
  selector: 'app-yourmanage',
  templateUrl: './yourmanage.component.html',
  styleUrls: ['./yourmanage.component.scss']
})
export class YourmanageComponent implements OnInit {
  constructor
    (
      private store: Store<{ problem: ProblemState }>,
      private router: Router
    ) { }

  selectedDifficulty: string = 'All';
  selectedStatus: string = 'All';

  problems$ = this.store.select('problem').pipe(map((problemState) => problemState.problems))
  loading$ = this.store.select('problem').pipe(map((problemState) => problemState.isLoading))
  previousDocument: DocumentSnapshot | undefined = undefined;

  ngOnInit(): void {
    this.store.dispatch(ProblemActions.getProblems({}));
  }

  viewProblem(problem: Problem) { this.router.navigate(['/problem', problem._id]); }

}
