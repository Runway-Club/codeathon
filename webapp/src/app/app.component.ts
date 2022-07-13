import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { fetchAuth } from 'src/actions/auth.action';
import { fetchProgrammingLanguages } from 'src/actions/info.action';
import { createProfile, fetchProfile } from 'src/actions/profile.action';
import { UserProfile } from 'src/models/profile.model';
import { AuthState } from 'src/states/auth.state';
import { InfoState } from 'src/states/info.state';
import { UserProfileState } from 'src/states/profile.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  fetchAuth$: Observable<AuthState>;
  profile$: Observable<UserProfileState>;
  authState?: AuthState

  constructor(private store: Store<{ auth: AuthState, profile: UserProfileState, info: InfoState }>, private toast: NbToastrService) {
    this.fetchAuth$ = this.store.select('auth');
    this.profile$ = this.store.select('profile');
    this.store.dispatch(fetchAuth());
    this.store.dispatch(fetchProgrammingLanguages());
  }
  ngOnInit(): void {
    this.fetchAuth$.subscribe(auth => {
      // console.log(auth);
      if (auth.isLoggedIn && auth.uid != '') {
        this.authState = auth;
        // console.log("Fetch profile");
        // fetch profile
        this.store.dispatch(fetchProfile({ id: auth.uid }));
      }
    });
    this.profile$.subscribe(profile => {
      // console.log(profile);
      if (profile.error == "Profile not found" && this.authState != undefined) {
        // auto create new profile
        // console.log("Create new profile");
        this.store.dispatch(createProfile({ id: this.authState.uid }));
        return;
      }
      if (profile.error == "" && profile.profile != undefined && this.authState != undefined) {
        this.toast.primary("", "Welcome back, " + this.authState.displayName);
      }
    });
  }
}
