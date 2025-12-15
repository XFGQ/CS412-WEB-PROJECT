// lib/auth.ts

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers'; 

// --- Gerekli Global Değişkenler ---
const secretKey = process.env.JWT_SECRET || 'gizli-anahtar-yoksa-varsayilan';
const key = new TextEncoder().encode(secretKey);


// --- 1. signJWT (Login için Gerekli) ---
// BURADA MUTLAKA 'EXPORT' OLMALI
export async function signJWT(payload: { userId: number; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') 
    .sign(key);
}

// --- 2. verifyJWT (Middleware ve API'ler için Gerekli) ---
// BURADA MUTLAKA 'EXPORT' OLMALI
export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null; 
  }
}
export async function getAuthUser() {
    try {
        // cookies() çağrısı burada yapılıyor.
        const cookieStore = cookies();
         
         const tokenCookie = (await cookies()).get('token');
        if (!tokenCookie || !tokenCookie.value) {
            return null;
        }

        const token = tokenCookie.value;
        const payload = await verifyJWT(token);

        if (payload && payload.userId) {
            return { userId: Number(payload.userId), email: payload.email as string }; 
        }

        return null;
    } catch (error) {
        // Hata mesajı alıyoruz ama, hata ayıklama için bırakıyoruz.
        console.error("getAuthUser genel hatası:", error);
        return null; 
    }
}