import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect
} from '@angular/fire/auth';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = new Subject<User | null>();
  user: User | null = null;

  constructor(public auth: Auth) {
    onAuthStateChanged(auth, this.updateUser);
  }

  updateUser = (user: User | null) => {
    this.user = user;
    this.user$.next(user);
  }

  login() {
    let provider = new GoogleAuthProvider();
    signInWithRedirect(this.auth, provider);
  }

  logout() {
    this.auth.signOut();
  }

}
