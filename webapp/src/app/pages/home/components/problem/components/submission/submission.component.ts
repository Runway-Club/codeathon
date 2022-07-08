import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  submissions = [
    {
      submitBy: "Đức Trọng",
      timeLimit: 8.99,
      memoryLimit: 256,
      language: "Javascript",
      score: 80
    },
    {
      submitBy: "Trung Tôm",
      timeLimit: 8.99,
      memoryLimit: 150,
      language: "C++",
      score: 100

    },
    {
      submitBy: "Trung Xôi",
      timeLimit: 8.99,
      memoryLimit: 100,
      language: "Ruby",
      score: 100
    }
  ]

  filter(value: string) {
    if (value == "timeLimit") {
    } else if (value == "memoryLimit") {
    } else {
    }
  }

}
