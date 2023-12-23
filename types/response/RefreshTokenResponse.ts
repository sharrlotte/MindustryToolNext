export default interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expireTime: Date;
}
