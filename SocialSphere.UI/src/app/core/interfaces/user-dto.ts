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
}
