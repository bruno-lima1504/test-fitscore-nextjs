import { IAuthenticatedUser } from "./user.types";

export type IAuthContextType = {
  user: IAuthenticatedUser | null;
  login: (user: IAuthenticatedUser) => void;
  logout: () => void;
};

export type IAuthResponse = {
  token: string;
  authenticatedUser: IAuthenticatedUser;
};

export type IAuthErrorResponse = {
  name: string;
  message: string;
  action: string;
  status_code: number;
};
