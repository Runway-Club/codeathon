import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
  numberOfDay = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];
  day: any;
  constructor() {}

  ngOnInit(): void {}
  listOfProblem = [
    { title: 'Pytago', timeAccess: Date.now() },
    { title: 'Fibbonaci', timeAccess: Date.now() },
    { title: 'Title of problem 1', timeAccess: Date.now() },
    { title: 'Title of problem 2', timeAccess: Date.now() },
    { title: 'Title of problem 3', timeAccess: Date.now() },
  ];

  upcomingTime = Date.now();

  parseMonth() {
    switch (new Date().getDay()) {
      case 0:
        this.day = 'Sunday';
        break;
      case 1:
        this.day = 'Monday';
        break;
      case 2:
        this.day = 'Tuesday';
        break;
      case 3:
        this.day = 'Wednesday';
        break;
      case 4:
        this.day = 'Thursday';
        break;
      case 5:
        this.day = 'Friday';
        break;
      case 6:
        this.day = 'Saturday';
    }
    return this.day;
  }
}
