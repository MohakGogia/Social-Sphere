import { PhotoDTO } from './photo-dto';

export interface UserDTO {
  id?: number;
  userName: string;
  email: string;
  dateOfBirth: Date;
  age?: number;
  lastActive?: Date;
  createdAt?: Date;
  gender: string;
  isInactive?: boolean;
  bio: string;
  interests: string;
  city: string;
  country: string;
  profileImageUrl?: string;
  profileImagePublicId?: string;
  photos?: PhotoDTO[];
  followedUserIds?: number[]; // users who i follow
  followedByUserIds?: number[]; // users who follow me
}
