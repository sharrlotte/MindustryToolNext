import { JWT, JWTDecodeParams, JWTEncodeParams } from '@auth/core/jwt';
import { SignJWT, jwtVerify } from 'jose';

export async function encodeJWT({
  maxAge,
  secret,
  token,
}: JWTEncodeParams<JWT>) {
  return await new SignJWT(token ?? {})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(maxAge ? maxAge * 1000 : 60 * 1000)
    .sign(new TextEncoder().encode(secret));
}

export async function decodeJWT({ secret, token }: JWTDecodeParams) {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );
    return payload as JWT;
  } catch (error) {
    console.error(error);
    return null;
  }
}
