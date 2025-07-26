export interface LoginPayload {
  email: string;
  password: string;
};

export interface RegisterPayload extends LoginPayload {
  confirmPassword: string;
};

export interface formValidityType {
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
};  