//import { User } from "./user.model";
import { User } from 'src/app/models/user'

export interface JwtToken {
  isAuthenticated: boolean;
  token: string;
  user?: User;
}
