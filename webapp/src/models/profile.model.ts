import { User } from '@angular/fire/auth';
export interface UserProfile {
    displayName?: string;
    email?: string;
    photoURL?: string;
    role?: string;
    uid: string;
}
