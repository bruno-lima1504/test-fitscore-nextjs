export interface IUser {
  id_user?: string;
  name: string;
  email: string;
  password: string;
  position?: string;
  created_at?: Date;
}

export interface IAuthenticatedUser {
  id_user: string;
  name: string;
  email: string;
  position: string;
}

export interface IAuthUserInput {
  email: string;
  password: string;
}
