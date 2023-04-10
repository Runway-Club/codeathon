export interface UserProfile {
    displayName?: string;
    email?: string;
    photoURL?: string;
    role?: UserRole;
    uid: string;
}

export enum UserRole {
    ADMIN = 0,
    MODERATOR = 1,
    MEMBER = 2,
    GUEST = 4,
}

