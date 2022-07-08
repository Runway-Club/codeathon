import { Component, OnInit } from '@angular/core';
import { NbToast, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { createProblem, createProblemFailure } from 'src/actions/problem.action';
import { ProblemSample } from 'src/models/sample.model';
import { Testcase } from 'src/models/testcase.model';
import { ProblemCreation } from 'src/states/problem.state';

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.scss']
})
export class NewProblemComponent implements OnInit {

  constructor(private store: Store<{ problemCreation: ProblemCreation }>, private toast: NbToastrService) {
    this.problemCreation$ = this.store.select('problemCreation');
  }

  title = "Title of the problem";
  description = "Description of the problem";
  samples: ProblemSample[] = [];
  testcases: Testcase[] = [];
  tags = "";
  tagArray: string[] = [];
  problemStatement = "";
  timeLimit = 60;
  memoryLimit = 100;
  difficulty = 1;

  allowCreateProblem = true;

  problemCreation$: Observable<ProblemCreation>;

  ngOnInit(): void {
    this.problemCreation$.subscribe(state => {
      if (state.success) {
        this.toast.success("200 OK!", "Problem created successfully");
      }
      else {
        if (state.error == undefined) {
          return;
        }
        if (state.error.length > 0) {
          this.toast.danger(state.error, "Cannot create new problem");
        }
      }
      this.allowCreateProblem = true;
    });
  }

  addSample() {
    this.samples.push({
      input: "",
      output: ""
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
      input: "",
      output: "",
      timeLimit: 60,
      memoryLimit: 100,
      score: 0,
      allowViewOnFailed: false
    });
  }

  changeTag() {
    let tags = this.tags.split(",");
    this.tagArray.splice(0, this.tagArray.length);
    for (let tag of tags) {
      this.tagArray.push(tag.trim());
    }
  }

  createProblem() {
    this.allowCreateProblem = false;
    if (this.problemStatement.length == 0) {
      this.store.dispatch(createProblemFailure({ error: "Problem statement must be filled" }));
      return;
    }
    if (this.testcases.length === 0) {
      this.store.dispatch(createProblemFailure({ error: "No testcase is added" }));
      return;
    }
    let problem = {
      title: this.title,
      description: this.description,
      content: this.problemStatement,
      tags: this.tagArray,
      samples: this.samples,
      testcases: this.testcases,
      difficulty: this.difficulty,
      timeLimit: this.timeLimit,
      memoryLimit: this.memoryLimit,
      createdAt: Date.now()
    }
    console.log(problem);
    this.store.dispatch(createProblem({
      problem: problem
    }));
  }

}
