import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Submission } from 'src/models/submission';
import { AuthState } from 'src/states/auth.state';
import { SubmissionDetailState, SubmitState } from 'src/states/submit.state';
import * as SubmissionActions from '../../../../../../../actions/submit.action';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public submissionDetail$: Observable<SubmissionDetailState>;
  public submissions$: Observable<SubmitState>;
  public auth$: Observable<AuthState>;
  // public submission!: Submission;
  public mySubmission: Submission[] = [];

  @Output() sourceCode = new EventEmitter<{
    language_id: number,
    source: string
  }>();

  @Input() problem_id!: string;

  constructor(
    private store: Store<{
      SubmissionDetail: SubmissionDetailState,
      submit: SubmitState,
      auth: AuthState
    }>
  ) {
    this.submissionDetail$ = this.store.select(state => state.SubmissionDetail);
    this.submissions$ = this.store.select(state => state.submit);
    this.auth$ = this.store.select(state => state.auth);
  }

  //process
  processSubmission = (res: any) => {
    this.mySubmission = res.mySubmission;
  }

  processAuth = (res: any) => {
    if (res.isLoggedIn && this.problem_id) {
      this.store.dispatch(SubmissionActions.fetchSubmissions({ userId: res.uid, problemId: this.problem_id }));
    }
  }

  ngOnInit(): void {
    this.submissions$.subscribe(this.processSubmission)
    this.auth$.subscribe(this.processAuth)
  }

  public viewSrcCode(source: string, language_id: number) {
    if (!source || !language_id) return;

    this.sourceCode.emit({
      language_id,
      source
    });
  }

}
