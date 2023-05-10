import { Component, Input, OnInit } from '@angular/core';
import { ProblemService } from 'src/app/services/problem.service';
import { Problem, TestCase } from 'src/models/problem.model';
import { Submission } from 'src/models/submission';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  constructor(private problemService: ProblemService) { }

  @Input() problem: Problem = {} as Problem;
  @Input() submissions?: Submission[] | null = [];

  samples: TestCase[] = [];

  ngOnInit(): void {
    this.getAllSample(this.problem._id);
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

  getAllSample = async (id: string | undefined) => {
    if (id == undefined) {
      return;
    }
    const samples = await this.problemService.getSamples(id);
    this.samples = samples;
  }

}
