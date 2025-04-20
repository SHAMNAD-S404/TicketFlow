import { UserRoles } from "../../types/roles";

export interface IUser {
  email: string;
  password: string;
  role: UserRoles;
  authUserUUID: string;
  isFirstLogin: boolean;
  isBlock: boolean;
}
