import { Roles } from '../interfaces/enums';

export type User = {
  userName: string;
  email: string;
  role: Roles;
  photoUrl: string;
}
