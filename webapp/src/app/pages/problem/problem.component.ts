import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';

import { Store } from '@ngrx/store';

import { ProblemState } from 'src/app/ngrx/states/problems.state';
import { ProblemActions } from 'src/app/ngrx/actions/problems.action';

import { SubmissionState } from 'src/app/ngrx/states/submission.state';
import { SubmissionActions } from 'src/app/ngrx/actions/submission.action';
import { Submission } from 'src/models/submission';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent {

  constructor(
    private store: Store<{
      problem: ProblemState,
      submission: SubmissionState,
    }>,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) { }

  user = this.authService.user;
  problemID?: string;
  intervalSubmission?: any;

  isLoading$ = this.store.select('problem').pipe(map(state => state.isLoading));
  problem$ = this.store.select('problem').pipe(map(state => state.problem));

  submissions$ = this.store.select('submission').pipe(map(state => state.submissions));

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(this.processProblem);
    this.submissions$.subscribe(this.handleIntervalSubmission);
  }

  processProblem = (params: any) => {
    this.problemID = params.id;
    this.store.dispatch(ProblemActions.getProblem({ id: params.id }));
    this.store.dispatch(SubmissionActions.getSubmissions({ userID: this.user?.uid!, problemID: params.id }));
  }

  handleIntervalSubmission = (submissions: Submission[]) => {
    if (submissions === null) return;
    if (submissions.length === 0) return;

    const submission = submissions.find(submission => submission.evaluated !== true);

    if (!submission) {
      clearInterval(this.intervalSubmission);
    }
  }

  handleSubmitCode = (code: any) => {
    this.store.dispatch(SubmissionActions.createSubmission({ submission: code }));
    this.intervalSubmission = setInterval(() => {
      this.store.dispatch(SubmissionActions.getSubmissions({ userID: this.user?.uid!, problemID: this.problemID! }));
    }, 3000);
  }

}
