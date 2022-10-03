import { Injectable } from '@angular/core';
import { Firestore, getDoc, doc } from "@angular/fire/firestore";
import {collection} from "@firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private fs: Firestore
  ) { }

  async getUserById(id: string): Promise<any> {
    const ref = doc(this.fs, 'profiles', "NaKOstavxCa6IQ3FOoZYoovXldm2");
    return await getDoc(ref);
  }

}
