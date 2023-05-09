import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';

import { Store } from '@ngrx/store';

import { ProblemState } from 'src/app/ngrx/states/problems.state';
import { ProblemActions } from 'src/app/ngrx/actions/problems.action';

import { SubmissionState } from 'src/app/ngrx/states/submission.state';
import { SubmissionActions } from 'src/app/ngrx/actions/submission.action';
import { Firestore, onSnapshot, collection } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-newproblem',
  templateUrl: './newproblem.component.html',
  styleUrls: ['./newproblem.component.scss'],
})
export class NewproblemComponent implements OnInit {
  userStorage: any;
  constructor(
    private store: Store<{
      problem: ProblemState;
      submission: SubmissionState;
    }>,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private database: Firestore
  ) {
    this.userStorage = JSON.parse(localStorage.getItem('userStorage')!);
  }

  user = this.authService.user;

  problemID?: string;

  isLoading$ = this.store
    .select('problem')
    .pipe(map((state) => state.isLoading));
  problem$ = this.store.select('problem').pipe(map((state) => state.problem));

  submissions$ = this.store
    .select('submission')
    .pipe(map((state) => state.submissions));

  ngOnInit(): void {
    console.log(this.userStorage);
    this.activatedRoute.params.subscribe(this.processProblem);

    //wait for new snapshot
    onSnapshot(collection(this.database, 'submissions'), (snapshot) => {
      this.store.dispatch(
        SubmissionActions.getSubmissions({
          userID: this.user?.uid!,
          problemID: this.problemID!,
        })
      );
    });
  }

  processProblem = (params: any) => {
    this.problemID = params.id;
    this.store.dispatch(ProblemActions.getProblem({ id: params.id }));
    this.store.dispatch(
      SubmissionActions.getSubmissions({
        userID: this.user?.uid!,
        problemID: params.id,
      })
    );
  };

  handleSubmitCode = (code: any) => {
    this.store.dispatch(
      SubmissionActions.createSubmission({ submission: code })
    );
  };
}
