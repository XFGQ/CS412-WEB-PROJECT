import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        // 1. Token'dan AuthUser ID'sini al
        const authUser = await getAuthUser();
        if (!authUser) {
            // Token yok veya geçersizse 401 döndür
            return new NextResponse('Yetkisiz Erişim.', { status: 401 });
        }
        
        // 2. ID ile kullanıcı detaylarını veritabanından çek
        const userDetails = await db.select({
            id: users.id,
            email: users.email,
            username: users.username,
            avatarUrl: users.avatarUrl,
        })
        .from(users)
        .where(eq(users.id, authUser.userId))
        .limit(1);

        if (userDetails.length === 0) {
            return new NextResponse('Kullanıcı bulunamadı.', { status: 404 });
        }

        // Şifresiz kullanıcı detaylarını döndür
        return NextResponse.json(userDetails[0]);

    } catch (error) {
        console.error('Kullanıcı Bilgisi Çekme Hatası:', error);
        return new NextResponse('Sunucu hatası.', { status: 500 });
    }
}