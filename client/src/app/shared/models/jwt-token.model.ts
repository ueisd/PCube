import { User } from "./user.model";

export interface JwtToken {
  isAuthenticated: boolean;
  token: string;
  user?: User;
}
