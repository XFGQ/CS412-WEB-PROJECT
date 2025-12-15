import { NextResponse } from 'next/server'; // Sadece NextResponse yeterli
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/auth'; // signJWT artık export ediliyor

// Gereksiz import kaldırıldı:
// import { NextRequest, NextResponse } from 'next/server' 


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { identifier, password } = body;

        // 1. Basit Validasyon
        if (!identifier || !password) {
            return NextResponse.json({ message: 'Email or Username is missing!' }, { status: 400 });
        }

        // 2. Kullanıcıyı bul (Email veya Kullanıcı Adı ile)
        const userResult = await db.select().from(users).where(
            or(
                eq(users.email, identifier),
                eq(users.username, identifier)
            )
        );
        const user = userResult[0];

        if (!user || !user.password) {
            return NextResponse.json({ message: 'User not found or invalid email/username.' }, { status: 404 });
        }
        
        // 3. Şifre Doğrulama
        const isPasswordCorrect = await bcrypt.compare(password, user.password);        
        
        if (!isPasswordCorrect) {
            return NextResponse.json({ message: 'Password wrong' }, { status: 401 }); 
        }
        
        // 4. Token Oluşturma ve Cevap Hazırlama
        const token = await signJWT({ userId: user.id, email: user.email });   
        
        // 'Response' sınıfı yerine 'response' değişken adı kullanıldı
        const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });

        // 5. Cookie Ayarları (HttpOnly ve Güvenlik Odaklı)
        response.cookies.set ({
            name: 'token',
            value: token,
            httpOnly: true, // XSS koruması
            secure: process.env.NODE_ENV === 'production', // Sadece HTTPS'de
            sameSite: 'strict', 
            maxAge: 24 * 60 * 60, // 24 saat
            path: '/', 
        });
        
        return response;
        
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Server Fault' }, { status: 500 });
    }
}