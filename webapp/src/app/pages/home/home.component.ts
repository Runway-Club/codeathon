import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login, logout } from 'src/actions/auth.action';
import { AuthState } from 'src/states/auth.state';
import { ProblemListing } from 'src/states/problem.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  authState$: Observable<AuthState>;
  authState?: AuthState;

  constructor(private store: Store<{ auth: AuthState }>) {
    this.authState$ = this.store.select('auth');
    this.authState$.subscribe(auth => {
      this.authState = auth;
    });
  }

  ngOnInit(): void {

  }

  login() {
    this.store.dispatch(login());
  }

  createNewProblem() {
    window.location.href = '/problem-editor';
  }

  signout() {
    this.store.dispatch(logout());
  }

}
