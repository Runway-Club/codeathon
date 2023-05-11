import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-achievement',
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.scss'],
})
export class AchievementComponent implements OnInit {
  userStorage: any;
  constructor() {
    this.userStorage = JSON.parse(localStorage.getItem('userStorage')!);
  }

  ngOnInit(): void {}
}
