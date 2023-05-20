export interface JWTRecoverToken {
  userId: number;
  code: string;
  expiresAt: Date;
}
