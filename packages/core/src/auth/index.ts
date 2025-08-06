import { User } from "@repo/schema";

export type CurrentUser = {
  sub: string; //user id
  did: string; // device id
  tkv: number; // token version
  iat: number; // default jwt payload
  exp: number; // default jwt payload
};

export type LocalStrategyValidationResult = {
  message: string;
  success: boolean;
  user: User | null;
  status?: number;
};