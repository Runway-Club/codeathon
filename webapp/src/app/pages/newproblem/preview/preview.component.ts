import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Problem, ProblemSample, TestCase } from 'src/models/problem.model';
import { ProblemActions } from 'src/app/ngrx/actions/problems.action';
import { User } from '@angular/fire/auth';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  user!: User;

  constructor(private toast: NbToastrService) {
    this.user = JSON.parse(localStorage.getItem('userStorage')!);
  }

  ngOnInit(): void {}

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

  id = '';

  createProblemId() {
    return (
      Date.now().toString(36) +
      Math.floor(
        Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
      ).toString(36)
    );
  }
}
