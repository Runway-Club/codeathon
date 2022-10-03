import { UserProfile } from "src/models/profile.model";
import {User} from "@angular/fire/auth";

export interface UserProfileState {
    profile?: UserProfile;
    fetched: boolean;
    error: string;
}

