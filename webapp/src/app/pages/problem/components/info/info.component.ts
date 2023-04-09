import { Component, Input, OnInit } from '@angular/core';
import { Problem } from 'src/models/problem.model';
import { Submission } from 'src/models/submission';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  constructor() { }

  @Input() problem: Problem = {} as Problem;
  @Input() submissions?: Submission[] | null = [];

  ngOnInit(): void {
  }

  checkSubmission = (submission: Submission): string => {
    let result: string = "ACCEPTED";

    for (let i = 0; i < submission.testcases?.length!; i++) {
      if (submission.testcases![i].Message !== "PASS") {
        result = submission.testcases![i].Stderr || submission.testcases![i].Message;
        break;
      }
    }

    return result;
  }

}
