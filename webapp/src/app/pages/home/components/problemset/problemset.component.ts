
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Problem, ProblemSetPagination, Sort } from 'src/models/problem.model';

import { ProblemActions } from 'src/app/ngrx/actions/problems.action';
import { ProblemState } from 'src/app/ngrx/states/problems.state';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { map } from 'rxjs';
import { ProblemService } from 'src/app/services/problem.service';

@Component({
  selector: 'app-problemset',
  templateUrl: './problemset.component.html',
  styleUrls: ['./problemset.component.scss']
})
export class ProblemsetComponent implements OnInit {
  constructor(
    private store: Store<{ problem: ProblemState }>,
    private router: Router,
    private problemService: ProblemService
  ) { }

  selectedDifficulty: string = 'All';
  selectedStatus: string = 'All';

  sort: Sort = {
    field: 'difficulty',
    direction: 'asc'
  }

  paginate: ProblemSetPagination = {
    page: 1,
    limit: 2
  }

  totalProblems: number = 0;
  totalPages: any[] = [];

  problems$ = this.store.select('problem').pipe(map((problemState) => problemState.problems))
  loading$ = this.store.select('problem').pipe(map((problemState) => problemState.isLoading))

  ngOnInit(): void {
    this.store.dispatch(ProblemActions.getProblems({ paginate: this.paginate, sort: this.sort }));
    this.initialize();
  }

  async initialize() {
    this.totalProblems = await this.problemService.getTotalProblems();
    this.totalPages = Array(Math.ceil(this.totalProblems / this.paginate.limit)).fill(0).map((x, i) => i + 1);
  }

  viewProblem(problem: Problem) {
    this.router.navigate(['/problem', problem._id]);
  }

  changePage(page: any) {
    this.paginate = {
      ...this.paginate,
      page: page
    }
    this.store.dispatch(ProblemActions.getProblems({ paginate: this.paginate, sort: this.sort }));
  }

}

