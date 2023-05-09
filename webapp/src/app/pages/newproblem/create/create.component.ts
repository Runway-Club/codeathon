import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToast, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Problem } from 'src/models/problem.model';
import { ProblemSample } from 'src/models/problem.model';
import { TestCase } from 'src/models/problem.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  userId!: string;
  constructor(
    private store: Store<{}>,
    private toast: NbToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      let id = params['id'];

      this.editorTitle = 'Create a new problem';
    });
  }

  editorTitle = '';

  title = 'Title of the problem';
  description = 'Description of the problem';
  samples: ProblemSample[] = [];
  testcases: TestCase[] = [];
  tags = '';
  tagArray: string[] = [];
  problemStatement = '';
  timeLimit = 60;
  memoryLimit = 100;
  difficulty = 1;
  editMode = false;

  allowCreateProblem = false;
  allowUpdateProblem = false;
  allowDeleteProblem = false;
  allowResetSubmit = false;

  id = '';

  ngOnInit(): void {}

  addSample() {
    this.samples.push({
      input: '',
      output: '',
    });
  }

  removeSample(i: number) {
    this.samples.splice(i, 1);
  }

  removeTest(i: number) {
    this.testcases.splice(i, 1);
  }

  addTest() {
    this.testcases.push({
      input: '',
      expected_output: '',
      time_limit: 15,
      memory_limit: 2048,
      score: 0,
      allow_view_on_failed: false,
    });
  }

  changeTag() {
    let tags = this.tags.split(',');
    this.tagArray.splice(0, this.tagArray.length);
    for (let tag of tags) {
      this.tagArray.push(tag.trim());
    }
  }

  createId() {
    return (
      Date.now().toString(36) +
      Math.floor(
        Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
      ).toString(36)
    );
  }
}
