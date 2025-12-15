import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'gizli-anahtar-yoksa-varsayilan';
const key = new TextEncoder().encode(secretKey);

// Token Oluşturma (Giriş yaparken kullanılır)
export async function signJWT(payload: { userId: number; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Token 24 saat geçerli olsun
    .sign(key);
}

// Token Doğrulama (Sayfa gezerken kullanılır)
export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null; // Token geçersizse veya süresi dolmuşsa null döner
  }
}