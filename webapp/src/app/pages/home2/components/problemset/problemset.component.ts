import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { DocumentSnapshot } from '@angular/fire/firestore';

import { Problem } from 'src/models/problem.model';
import { ProblemListing } from 'src/states/problem.state';
import { listingProblem } from 'src/actions/problem.action';


@Component({
  selector: 'app-problemset',
  templateUrl: './problemset.component.html',
  styleUrls: ['./problemset.component.scss']
})
export class ProblemsetComponent implements OnInit {
  constructor(
    private store: Store<{ problemListing: ProblemListing }>,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    this.listing$ = this.store.select('problemListing');
  }

  selectedDifficulty: number = 0;
  selectedStatus: number = 0;

  listing$: Observable<ProblemListing>;
  problems: Problem[] = [];
  prevDoc: DocumentSnapshot | undefined = undefined;
  public isLoaded: boolean = false;

  processProblem = (problemListing: ProblemListing) => {
    this.problems.splice(0, this.problems.length);

    if (problemListing.list != undefined) {
      for (let i = 0; i < problemListing.list.length; i++) {
        this.problems.push(problemListing.list[i]);
      }
      this.isLoaded = true;
    }

    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.listing$.subscribe(this.processProblem);
    this.store.dispatch(listingProblem({ prevDoc: this.prevDoc }));
  }

  viewProblem(problem: Problem) {
    // console.log(problem);
    this.router.navigate(['/problem', problem.id]);
  }

}
