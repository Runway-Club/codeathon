import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login, logout } from 'src/actions/auth.action';
import { AuthState } from 'src/states/auth.state';
import { GetProblemListing, ProblemListing } from 'src/states/problem.state';
import { NbSearchService } from '@nebular/theme';
import { searchProblem } from '../../../actions/problem.action';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  authState$: Observable<AuthState>;
  authState?: AuthState;

  public searchingProblem$!: Observable<GetProblemListing>;

  constructor(
    private store: Store<{ auth: AuthState, problemSearching: GetProblemListing }>,
    private NbSearchService: NbSearchService) {
    this.authState$ = this.store.select('auth');
    this.searchingProblem$ = this.store.select('problemSearching');
    this.authState$.subscribe(auth => {
      this.authState = auth;
    });

    // this.NbSearchService.onSearchSubmit()
    //   .subscribe((data: any) => {
    //     this.getSearch(data.term);
    //   });

    this.NbSearchService.onSearchSubmit().subscribe((data: any) => {
            this.getSearch(data.term);
    });

  }

  ngOnInit(): void {
    this.searchingProblem$.subscribe(problem => {
      console.log(problem);
    })
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

  // getSearch(searchText: string) {
  //   console.log(`searching for ${searchText}`);
  //   this.store.dispatch(searchProblem({ query: searchText }))
  // }

  getSearch(searchText: string) {
    console.log(`searching for ${searchText}`);
    this.store.dispatch(searchProblem({ query: searchText }))
  }

}
