import { Component, OnInit } from '@angular/core';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { ProblemState } from 'src/states/problem.state';

// import { ProblemActions } from '../../../actions/problem.action';
import { Problem } from 'src/models/problem.model';


@Component({
  selector: 'app-manage-problem',
  templateUrl: './manage-problem.component.html',
  styleUrls: ['./manage-problem.component.scss']
})
export class ManageProblemComponent implements OnInit 
{
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
    // this.store.dispatch(ProblemActions.getProblems({ previousDocument: this.previousDocument }));
  }

  viewProblem(problem: Problem) {
    // console.log(problem);
    this.router.navigate(['/problem', problem.id]);
  }

}
