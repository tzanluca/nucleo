import { SignJWT, jwtVerify } from "jose";

/**
 * Sessão como JWT HS256 assinado. Sem estado no servidor (single-user).
 * Este módulo é edge-safe (só usa `jose` + WebCrypto) para poder rodar no
 * middleware do Next; a manipulação do cookie fica em `session-cookie.ts`.
 */
export const SESSION_COOKIE = "nucleo_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias, em segundos.

const ISSUER = "nucleo";
const AUDIENCE = "nucleo-app";

export interface SessionPayload {
  email: string;
}

function encodeSecret(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function signSession(
  payload: SessionPayload,
  secret: string,
): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(encodeSecret(secret));
}

export async function verifySession(
  token: string,
  secret: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodeSecret(secret), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return typeof payload.email === "string" ? { email: payload.email } : null;
  } catch {
    return null;
  }
}
