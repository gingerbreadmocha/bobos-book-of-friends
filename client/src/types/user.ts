export type PublicUser = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

export type LoginCredentials =
  | { email: string; password: string }
  | { username: string; password: string };

export type SignUpCredentials = {
  username: string;
  email: string;
  password: string;
};
