export interface AuthTokens {
  accessToken: string;
}
export interface RegisterInputs {
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
}
export interface LoginInputs {
  username: string;
  password: string;
}
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
