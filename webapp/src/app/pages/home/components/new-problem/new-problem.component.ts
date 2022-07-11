import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToast, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { createProblem, createProblemFailure, deleteProblem, getProblem, resetSubmissions, updateProblem } from 'src/actions/problem.action';
import { ProblemSample } from 'src/models/sample.model';
import { Testcase } from 'src/models/testcase.model';
import { ProblemCreation, ProblemDeletion, ProblemResetSubmissions, ProblemRetrieval, ProblemUpdation } from 'src/states/problem.state';

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.scss']
})
export class NewProblemComponent implements OnInit {

  constructor(private store: Store<{
    problemCreation: ProblemCreation,
    problemUpdation: ProblemUpdation,
    problemRetrieval: ProblemRetrieval,
    problemDeletion: ProblemDeletion,
    problemResetSubmissions: ProblemResetSubmissions
  }>,
    private toast: NbToastrService,
    private activatedRoute: ActivatedRoute) {
    this.problemCreation$ = this.store.select('problemCreation');
    this.problemRetrival$ = this.store.select('problemRetrieval');
    this.problemUpdation$ = this.store.select('problemUpdation');
    this.problemDeletion$ = this.store.select('problemDeletion');
    this.resetSubmissions$ = this.store.select('problemResetSubmissions');
    this.activatedRoute.queryParams.subscribe(params => {
      let id = params['id'];
      console.log(id);
      if (id != undefined) {
        this.id = id;
        this.store.dispatch(getProblem({ id: id }));
        this.editorTitle = "Edit Problem";
        this.allowUpdateProblem = true;
        this.allowDeleteProblem = true;
        this.allowResetSubmit = true;
        return;
      }
      this.allowCreateProblem = true;
      this.allowUpdateProblem = false;
      this.allowDeleteProblem = false;
      this.allowResetSubmit = false;

      this.editorTitle = "Create a new problem";
    });
  }

  editorTitle = "";

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
  editMode = false;

  allowCreateProblem = false;
  allowUpdateProblem = false;
  allowDeleteProblem = false;
  allowResetSubmit = false;

  id = "";

  problemCreation$: Observable<ProblemCreation>;
  problemUpdation$: Observable<ProblemUpdation>;
  problemRetrival$: Observable<ProblemRetrieval>;
  problemDeletion$: Observable<ProblemDeletion>;
  resetSubmissions$: Observable<ProblemResetSubmissions>;

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

    this.problemUpdation$.subscribe(state => {
      if (state.success) {
        this.toast.success("200 OK!", "Problem updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      else {
        if (state.error == undefined) {
          return;
        }
        if (state.error.length > 0) {
          this.toast.danger(state.error, "Cannot update problem");
        }
      }
    });

    this.problemRetrival$.subscribe(state => {
      console.log(state);
      if (!state.success || state.problem == undefined) {
        if (state.error == undefined) {
          return;
        }
        if (state.error.length > 0) {
          this.toast.danger(state.error, "Problem not found");
        }
        return;
      }
      this.allowCreateProblem = false;
      this.editMode = true;

      this.title = state.problem.title;
      this.description = state.problem.description;
      this.problemStatement = state.problem.content;
      this.tags = state.problem.tags.join(",");
      this.tagArray = [...state.problem.tags];
      this.samples.splice(0, this.samples.length);
      for (let sample of state.problem.samples) {
        this.samples.push({ ...sample });
      }
      this.testcases.splice(0, this.testcases.length);
      for (let testcase of state.problem.testcases) {
        this.testcases.push({ ...testcase });
      }
      this.timeLimit = state.problem.time_limit;
    });

    this.problemDeletion$.subscribe(state => {

      if (state.success) {
        this.allowDeleteProblem = true;
        this.toast.success("200 OK!", "Problem deleted successfully");
        setTimeout(() => {
          window.location.href = "/problem-editor";
        }, 2000);
      }
      else {
        if (state.error == undefined) {
          return;
        }
        if (state.error.length > 0) {
          this.toast.danger(state.error, "Cannot delete problem");
        }
      }
    });

    this.resetSubmissions$.subscribe(state => {

      if (state.success) {
        this.allowResetSubmit = true;
        this.toast.success("200 OK!", "Submissions reset successfully");
      }
      else {
        if (state.error == undefined) {
          return;
        }
        if (state.error.length > 0) {
          this.toast.danger(state.error, "Cannot reset submissions");
        }
      }
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
      expected_output: "",
      time_limit: 60,
      memory_limit: 100,
      score: 0,
      allow_view_on_failed: false
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
      time_limit: this.timeLimit,
      memory_limit: this.memoryLimit,
      createdAt: Date.now()
    }
    console.log(problem);
    this.store.dispatch(createProblem({
      problem: problem
    }));
  }

  updateProblem() {
    this.allowUpdateProblem = false;
    this.allowDeleteProblem = false;
    this.allowResetSubmit = false;
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
      time_limit: this.timeLimit,
      memory_limit: this.memoryLimit,
      createdAt: Date.now()
    }
    console.log(problem);
    this.store.dispatch(updateProblem({
      id: this.id,
      problem: problem
    }));
  }

  deleteProblem() {
    this.allowDeleteProblem = false;
    this.allowCreateProblem = false;
    this.allowUpdateProblem = false;
    this.store.dispatch(deleteProblem({
      id: this.id
    }));
  }
  resetSubmissions() {
    this.allowResetSubmit = false;
    this.store.dispatch(resetSubmissions({
      id: this.id
    }));
  }

}
