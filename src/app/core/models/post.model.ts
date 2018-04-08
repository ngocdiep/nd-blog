import { Profile } from './profile.model';

export interface Post {
    id: number;
    headline: string;
    body: string;
    createdAt: Date;
    userByAuthorId: Profile;
}
