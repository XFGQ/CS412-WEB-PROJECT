// app/api/chats/route.ts (POST fonksiyonu içinde)

import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { chats, chatMembers } from '@/db/schema';
import { getAuthUser } from '@/lib/auth';
import { and, eq, sql } from 'drizzle-orm'; // sql import edildi!

export async function POST(request: Request) {
    try {
        const authUser = await getAuthUser();
        // ... (authUser kontrolü ve body'den targetUserId alma kodları burada aynı kalacak) ...
        const currentUserId = authUser.userId;
        const body = await request.json();
        const { targetUserId } = body; 

        // ... (Validasyonlar burada aynı kalacak) ...

        // 3. Mevcut 1'e 1 Sohbeti Kontrol Etme
        // Bu, iki kullanıcının da üye olduğu, tipi 'private' olan bir chat olup olmadığını kontrol eder.
        
        // Önce, mevcut kullanıcının (currentUserId) üye olduğu tüm 'private' sohbet ID'lerini bulalım.
        const currentUserChats = await db.select({ chatId: chatMembers.chatId })
            .from(chatMembers)
            .innerJoin(chats, eq(chatMembers.chatId, chats.id))
            .where(and(eq(chatMembers.memberId, currentUserId), eq(chats.type, 'private')));

        const chatIds = currentUserChats.map(c => c.chatId);

        if (chatIds.length > 0) {
            // İkinci kullanıcı (targetUserId)'nin de bu sohbetlerden birinde olup olmadığını kontrol et
            const existingChatMembers = await db.select({ chatId: chatMembers.chatId })
                .from(chatMembers)
                .where(and(eq(chatMembers.memberId, targetUserId), sql`${chatMembers.chatId} IN ${chatIds}`))
                .limit(1);

            if (existingChatMembers.length > 0) {
                // Sohbet zaten var
                const existingChatId = existingChatMembers[0].chatId;
                return NextResponse.json({ 
                    chatId: existingChatId, 
                    message: 'Sohbet zaten mevcut.' 
                }, { status: 200 });
            }
        }
        
        // 4. Yeni Sohbet Oluşturma (Sohbet Yoksa)
        
        // İşlemleri tek bir Transaction içinde yapalım ki, ya hepsi başarılı olsun ya da hiçbiri.
        const result = await db.transaction(async (tx) => {
            // A) Yeni Chat Oluştur
            const [newChat] = await tx.insert(chats).values({
                type: 'private',
                adminId: currentUserId,
            }).returning({ id: chats.id });

            const newChatId = newChat.id;

            // B) Üyeleri Ekleme
            await tx.insert(chatMembers).values([
                { chatId: newChatId, memberId: currentUserId },
                { chatId: newChatId, memberId: targetUserId },
            ]);
            
            return newChatId;
        });


        return NextResponse.json({ 
            chatId: result, 
            message: 'Yeni özel sohbet başarıyla oluşturuldu.' 
        }, { status: 201 });

    } catch (error) {
        console.error('Chat Başlatma Hatası:', error);
        return new NextResponse('Sunucu Hatası: Sohbet başlatılamadı.', { status: 500 });
    }
}
// app/api/chats/route.ts (POST fonksiyonunun altına ekleyin)

import { users } from '@/db/schema'; // users tablosu da gerekli

// Kullanıcının tüm sohbetlerini listelemek için GET isteği
export async function GET(request: Request) {
    try {
        const authUser = await getAuthUser();
        if (!authUser) {
            return new NextResponse('Yetkisiz Erişim.', { status: 401 });
        }
        const currentUserId = authUser.userId;

        // 1. Kullanıcının üye olduğu tüm sohbetleri çek
        const userChats = await db.select({
            chatId: chats.id,
            type: chats.type,
            name: chats.name,
            adminId: chats.adminId,
            createdAt: chats.createdAt
        })
        .from(chatMembers)
        .innerJoin(chats, eq(chatMembers.chatId, chats.id))
        .where(eq(chatMembers.memberId, currentUserId))
        .orderBy(chats.createdAt); // En son oluşturulanlar üste gelsin

        // 2. Her sohbet için üyeleri ve son mesajı (şimdilik bu kısmı atlayıp sadece üyeleri alalım)
        
        const chatsWithMembers = await Promise.all(userChats.map(async (chat) => {
            // Sohbetin üyelerini çek
            const members = await db.select({
                id: users.id,
                username: users.username,
                email: users.email
            })
            .from(chatMembers)
            .innerJoin(users, eq(chatMembers.memberId, users.id))
            .where(eq(chatMembers.chatId, chat.chatId));

            // Eğer bire bir sohbet ise, sohbet adını karşıdaki kullanıcının adı yap
            if (chat.type === 'private') {
                const otherMember = members.find(m => m.id !== currentUserId);
                if (otherMember) {
                    // Chat objesini güncelleyelim
                    return {
                        ...chat,
                        name: otherMember.username,
                        members: members.map(m => ({ id: m.id, username: m.username })), // Detaylı bilgileri küçült
                        otherUserId: otherMember.id
                    };
                }
            }

            return {
                ...chat,
                members: members.map(m => ({ id: m.id, username: m.username })),
            };
        }));


        return NextResponse.json(chatsWithMembers);

    } catch (error) {
        console.error('Chat Listeleme Hatası:', error);
        return new NextResponse('Sunucu Hatası: Sohbetler listelenemedi.', { status: 500 });
    }
}