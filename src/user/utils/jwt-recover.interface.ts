export interface JWTRecoverToken {
  userId: number;
  userName: string;
  code: string;
  expiresAt: Date;
}
