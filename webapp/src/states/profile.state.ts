import { UserProfile } from "src/models/profile.model";

export interface UserProfileState {
    profile?: UserProfile;
    fetched: boolean;
    error: string;
}