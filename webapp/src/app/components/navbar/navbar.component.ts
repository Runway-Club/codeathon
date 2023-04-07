import { Component, Input, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() user: User | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
