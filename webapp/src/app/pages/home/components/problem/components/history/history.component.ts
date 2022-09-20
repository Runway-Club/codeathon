import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Submission } from 'src/models/submission';
import { SubmissionDetailState } from 'src/states/submit.state';
import * as SubmissionActions from '../../../../../../../actions/submit.action';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public submissionDetail$: Observable<SubmissionDetailState>;

  @Output() sourceCode = new EventEmitter<{
    language_id: number,
    source: string
  }>();

  constructor(
    private store: Store<{
      SubmissionDetail: SubmissionDetailState
    }>
  ) {
    this.submissionDetail$ = this.store.select(state => state.SubmissionDetail);
  }

  ngOnInit(): void {
    this.store.dispatch(SubmissionActions.fetchSubmissionDetail({ submissionId: "mhenz8j5uo94q9jufs3W" }));
    this.submissionDetail$.subscribe(
      res => {
        this.submission = res.submission;
        console.log(this.submission);
      }
    )
  }

  public viewSrcCode() {
    if (!this.submission.source) return;
    this.sourceCode.emit({
      language_id: this.submission.language_id,
      source: this.submission.source

    });
  }

  public date = Date.now()

  public submission!: Submission;

  public histories = [
    {
      testcases: [
        {
          inputProblem: "9 + 1",
          outPut: "10",
          isTrue: true,
          score: 30,
          timeLimit: 2,
          memoryLimit: 15
        },

        {
          inputProblem: "999 + 1",
          outPut: "1000",
          isTrue: true,
          score: 30,
          timeLimit: 2,
          memoryLimit: 15
        },

        {
          inputProblem: "998 + 1",
          outPut: "999",
          isTrue: true,
          score: 20,
          timeLimit: 2,
          memoryLimit: 15
        },
        {
          inputProblem: "99 + 2",
          outPut: "100",
          isTrue: false,
          score: 0,
          timeLimit: 2,
          memoryLimit: 15

        },
      ],
      dateSubmit: Date.now(),
    }
  ]

}
