import { Component, OnInit } from '@angular/core';
import { ProblemSample } from 'src/models/sample.model';
import { Testcase } from 'src/models/testcase.model';

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.scss']
})
export class NewProblemComponent implements OnInit {

  constructor() { }

  title = "Title of the problem";
  description = "Description of the problem";
  samples: ProblemSample[] = [];
  testcases: Testcase[] = [];
  tags = "";
  tagArray: string[] = [];
  problemStatement = "";

  ngOnInit(): void {
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
      timeLimit: 0,
      memoryLimit: 0,
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

}
