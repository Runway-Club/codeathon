export interface AuthState {
    isLoggedIn: boolean;
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    isFailure: boolean;
    error: string;
}