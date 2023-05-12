
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Problem, ProblemSetFilter, ProblemSetPagination, Sort } from 'src/models/problem.model';

import { ProblemActions } from 'src/app/ngrx/actions/problems.action';
import { ProblemState } from 'src/app/ngrx/states/problems.state';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { Subject, map } from 'rxjs';
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
    field: '_id',
    direction: 'asc'
  }

  paginate: ProblemSetPagination = {
    page: 1,
    limit: 10,
    totalPages: 1
  }

  filter: ProblemSetFilter = {
    status: '',
    difficulty: ''
  }

  totalProblems: number = 0;

  problems$ = this.store.select('problem').pipe(map((problemState) => problemState.problems))
  loading$ = this.store.select('problem').pipe(map((problemState) => problemState.isLoading))

  ngOnInit(): void {
    this.store.dispatch(ProblemActions.getProblems({ paginate: this.paginate, sort: this.sort }));
    this.initialize();
  }

  async initialize() {
    this.totalProblems = await this.problemService.getTotalProblems();
    this.paginate = {
      ...this.paginate,
      totalPages: Math.ceil(this.totalProblems / this.paginate.limit)
    }
  }

  viewProblem(problem: Problem) {
    this.router.navigate(['/problem', problem._id]);
  }

  handleChangePage(page: any) {
    this.paginate = {
      ...this.paginate,
      page: page
    }

    this.store.dispatch(ProblemActions.getProblems({ paginate: this.paginate, sort: this.sort, filter: this.filter }));
  }

  handleChangeStatus(status: string) {
    this.filter = {
      ...this.filter,
      status: status
    }

    this.store.dispatch(ProblemActions.getProblems({ paginate: this.paginate, sort: this.sort, filter: this.filter }));
  }

  handleChangeDifficulty(difficulty: string) {
    this.filter = {
      ...this.filter,
      difficulty: difficulty
    }

    this.store.dispatch(ProblemActions.getProblems({ paginate: this.paginate, sort: this.sort, filter: this.filter }));
  }

  updateSort(field: string, direction: "asc" | "desc") {
    this.sort = {
      field: field,
      direction: direction
    }

    this.store.dispatch(ProblemActions.getProblems({ paginate: this.paginate, sort: this.sort, filter: this.filter }));
  }

  changeSort(field: string) {
    if (this.sort.field === '_id' || this.sort.field !== field) {
      this.updateSort(field, 'asc');
      return;
    }

    if (this.sort.direction === 'asc') {
      this.updateSort(field, 'desc');
      return;
    }

    if (this.sort.direction === 'desc') {
      this.updateSort("_id", 'asc');
      return;
    }

  }


}

