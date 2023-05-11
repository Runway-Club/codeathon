import { Component, Input, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor() {}

  @Input() user: User | null = null;

  menuItems = [
    { title: 'Profile' },
    { title: 'Manage', link: 'manage' },
    { title: 'New Problem', link: '/newproblem' },
    { title: 'Achievement', link: '/achievement' },
    { title: 'Log out' },
  ];

  ngOnInit(): void {}
}
