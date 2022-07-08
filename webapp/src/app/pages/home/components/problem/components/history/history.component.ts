import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public date = Date.now()

  public histories = [
    {
      testcases: [
        {
          inputProblem: "9 + 1",
          outPut: "10",
          isTrue: true,
          score: 30,
          timeLimit: 2,
          memoryLimit: 15
        },

        {
          inputProblem: "999 + 1",
          outPut: "1000",
          isTrue: true,
          score: 30,
          timeLimit: 2,
          memoryLimit: 15
        },

        {
          inputProblem: "998 + 1",
          outPut: "999",
          isTrue: true,
          score: 20,
          timeLimit: 2,
          memoryLimit: 15
        },
        {
          inputProblem: "99 + 2",
          outPut: "100",
          isTrue: false,
          score: 0,
          timeLimit: 2,
          memoryLimit: 15

        },
      ],
      dateSubmit: Date.now(),
    }
  ]

}
