import { Component, Input, OnInit } from '@angular/core';
import { NbGetters, NbSortDirection, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Submission } from 'src/models/submission';
import { SubmissionProblemState } from 'src/states/submit.state';
import * as Submissions from '../../../../../../../actions/submit.action';
import { ProgrammingLanguage } from "../../../../../../../models/info.model";
import { InfoState } from "../../../../../../../states/info.state";
import { UserProfileState } from "../../../../../../../states/profile.state";
import * as ProfileActions from '../../../../../../../actions/profile.action';
import { UserProfile } from "../../../../../../../models/profile.model";
import { UserService } from "../../../../../../services/user.service";

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

  constructor(
    dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private store: Store<{
      SubmissionProblem: SubmissionProblemState,
      info: InfoState,
      profile: UserProfileState
    }>,
    private userService: UserService
  ) {
    const getters: NbGetters<FSEntry, FSEntry> = {
      dataGetter: (node: FSEntry) => node,
      childrenGetter: (node: FSEntry) => node.childEntries || undefined,
      expandedGetter: (node: FSEntry) => !!node.expanded,
    };
    this.source = dataSourceBuilder.create(this.data, getters);
    this.fetchSubmissionProblem$ = this.store.select(state => state.SubmissionProblem);
    this.fetchLanguages$ = this.store.select(state => state.info);
    this.fetchProfile$ = this.store.select(state => state.profile);
  }

  public submissions: Submission[] = [];
  public languages: ProgrammingLanguage[] = [];
  public profile!: UserProfile;
  public fetchSubmissionProblem$: Observable<SubmissionProblemState>;
  public fetchLanguages$: Observable<InfoState>;
  public fetchProfile$: Observable<UserProfileState>;

  //process
  processFetchSubmissionProblem = (res: any) => {
    if (!res.isSubmissionProblem) return;

    this.submissions = res.submissions;
    res.submissions.map(async (s: any) => {
      // console.log(s)
      // console.log({
      //   "Submit By": await this.getProfile(s.user_id),
      //   "Time (ms)": s.total_time,
      //   "Memory": s.total_memory,
      //   "Language": this.getLanguage(s.language_id),
      //   "Score": s.score
      // })
      // this.data.push();
    })
    // console.log(this.data);
  }

  processFetchLanguages = (res: any) => {
    if (!res.fetched) return;

    res.info.programmingLanguages.map((value: any) => {
      this.languageMap.set(value.id, value.name);
    });
  }


  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.store.dispatch(Submissions.fetchSubmissionProblem({ problemId: this.problemId }));

    this.fetchSubmissionProblem$.subscribe(this.processFetchSubmissionProblem)
    this.fetchLanguages$.subscribe(this.processFetchLanguages)
  }

  sortDirection: NbSortDirection = NbSortDirection.NONE;
  sortColumn!: string;

  public languageMap = new Map();

  getLanguage(id: number) {
    if (this.languageMap.size === 0) return;
    return this.languageMap.get(id);
  }

  private data: any = [
    // {
    //   "Submit By": "Duc Trong",
    //   "Time (ms)": 3.6,
    //   "Memory": 100,
    //   "Language": "Javascript",
    //   "Score": 80
    // },
    // {
    //   "Submit By": "Duc Trong",
    //   "Time": 1.8,
    //   "Memory": 50,
    //   "Language": "Ruby",
    //   "Score": 80
    // },
    // {
    //   "Submit By": "Duc Trong",
    //   "Time": 2.1,
    //   "Memory": 200,
    //   "Language": "C++",
    //   "Score": 80
    // }
  ];

  async getProfile(id: string) {
    let user = await this.userService.getUserById(id);
    return user;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

}
