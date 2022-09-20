import { Component, Input, OnInit } from '@angular/core';
import { NbGetters, NbSortDirection, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Submission } from 'src/models/submission';
import { SubmissionProblemState } from 'src/states/submit.state';
import * as Submissions from '../../../../../../../actions/submit.action';
interface FSEntry {
  name: string;
  size: string;
  kind: string;
  items?: number;
  childEntries?: FSEntry[];
  expanded?: boolean;
}
@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {

  @Input() problemId: string = ""

  customColumn = 'Submit By';
  defaultColumns = ['Time (ms) ', 'Memory (KB) ', 'Language', 'Score'];
  allColumns = [this.customColumn, ...this.defaultColumns];
  source: NbTreeGridDataSource<FSEntry>;

  constructor(dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>, private store: Store<{
    SubmissionProblem: SubmissionProblemState,
  }>) {
    const getters: NbGetters<FSEntry, FSEntry> = {
      dataGetter: (node: FSEntry) => node,
      childrenGetter: (node: FSEntry) => node.childEntries || undefined,
      expandedGetter: (node: FSEntry) => !!node.expanded,
    };
    this.source = dataSourceBuilder.create(this.submissions, getters);
    this.fetchSubmissionProblem$ = this.store.select(state => state.SubmissionProblem);
  }

  public submissions: Submission[] = [];
  public fetchSubmissionProblem$: Observable<SubmissionProblemState>;

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.store.dispatch(Submissions.fetchSubmissionProblem({ problemId: this.problemId }));
    this.fetchSubmissionProblem$.subscribe(
      res => {
        console.log(res.submissions);
        this.submissions = res.submissions;
      }
    )
  }

  sortDirection: NbSortDirection = NbSortDirection.NONE;
  sortColumn!: string;
  updateSort(sortRequest: any): void {
    // this.sortColumn = sortRequest.column;
    // this.sortDirection = sortRequest.direction;
  }

  private data: any = [
    {
      "Submit By": "Duc Trong",
      "Time (ms)": 3.6,
      "Memory": 100,
      "Language": "Javascript",
      "Score": 80
    },
    {
      "Submit By": "Duc Trong",
      "Time": 1.8,
      "Memory": 50,
      "Language": "Ruby",
      "Score": 80
    },
    {
      "Submit By": "Duc Trong",
      "Time": 2.1,
      "Memory": 200,
      "Language": "C++",
      "Score": 80
    }
  ];

  getShowOn(index: any) { }
  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

}
