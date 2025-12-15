'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMessageSquare, FiUser, FiLogOut, FiUsers, FiSearch } from 'react-icons/fi';
// İkonlar için npm install react-icons komutunu çalıştırdığınızdan emin olun.

// Arayüzler
interface Member {
  id: number;
  username: string;
}

interface Chat {
  chatId: number;
  type: 'private' | 'group';
  name: string; // Private ise karşı tarafın username'i, Group ise grubun adı
  members: Member[];
  otherUserId?: number; // Sadece private chat'ler için
}

interface AuthUser {
  id: number;
  email: string;
  username: string;
}

// SIMÜLASYON YERİNE GERÇEK VERİ ÇEKME YARDIMCISI
const fetchAuthenticatedUser = async (router: any) => {
    const response = await fetch('/api/user/me'); // İleride yazacağımız API
    if (response.status === 401) {
        // Token süresi dolduysa veya geçersizse login'e at
        router.push('/login');
        return null;
    }
    if (!response.ok) return null;
    return response.json();
}

export default function ChatPage() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    // --- AUTH VE VERİ ÇEKME İŞLEMLERİ ---

    useEffect(() => {
        // 1. Giriş Yapan Kullanıcının Bilgilerini Çekme (Auth)
        // DİKKAT: Bunun için /api/user/me API'sini yazmalıyız (Aşağıda Adım 2)
        const loadData = async () => {
            setLoading(true);
            const authUser = await fetchAuthenticatedUser(router);
            if (authUser) {
                setUser(authUser);
                // 2. Kullanıcının Sohbet Listesini Çekme (API/chats GET)
                await loadChats();
            }
            setLoading(false);
        };
        loadData();
    }, [router]);
    
    const loadChats = async () => {
        const chatsResponse = await fetch('/api/chats');
        if (chatsResponse.ok) {
            const chatList = await chatsResponse.json();
            setChats(chatList);
            // Genellikle en üstteki sohbeti otomatik seçeriz
            if (chatList.length > 0) {
                setActiveChat(chatList[0]);
            }
        }
    };
    
    // Çıkış yapma fonksiyonu (Önceki Adımda Yazdık)
    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
    };
    
    // --- RENDER BÖLÜMÜ ---

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full text-gray-400">
                <svg className="animate-spin h-8 w-8 text-indigo-500 mr-3" viewBox="0 0 24 24">...</svg>
                Zen Chat Yükleniyor...
            </div>
        );
    }
    
    if (!user) {
        return null; // Yükleme bitti ama kullanıcı yoksa middleware login'e atacaktır.
    }

    return (
        // Ana Konteyner: 100vh ve tam ekran genişliği, merkezi card yapısının içinde
        <div className="flex w-full h-[85vh] max-w-7xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
            
            {/* SOL PANEL: Sohbet Listesi (Sabit Genişlik) */}
            <div className="w-80 border-r border-gray-700 flex flex-col">
                
                {/* Header / Kullanıcı Bilgisi */}
                <div className="p-4 bg-gray-700 flex items-center justify-between shadow-md">
                    <div className="flex items-center">
                        <FiUser className="w-5 h-5 mr-2 text-indigo-400" />
                        <span className="font-semibold text-lg text-gray-50">{user.username}</span>
                    </div>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition">
                        <FiLogOut className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Arama Çubuğu */}
                <div className="p-3 border-b border-gray-700">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Kullanıcı veya Sohbet Ara..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Sohbet Listesi */}
                <div className="flex-1 overflow-y-auto">
                    {chats.length > 0 ? (
                        chats.map((chat) => (
                            <div
                                key={chat.chatId}
                                onClick={() => setActiveChat(chat)}
                                className={`flex items-center p-4 cursor-pointer transition duration-150 ${
                                    activeChat?.chatId === chat.chatId ? 'bg-indigo-900/40 border-l-4 border-indigo-500' : 'hover:bg-gray-700'
                                }`}
                            >
                                <div className="flex-shrink-0 mr-3">
                                    {chat.type === 'group' ? (
                                        <FiUsers className="w-6 h-6 text-yellow-400" />
                                    ) : (
                                        <FiUser className="w-6 h-6 text-green-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-gray-50 font-medium">{chat.name}</p>
                                    <p className="text-xs text-gray-400">Son mesaj burada görünür...</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-gray-500 text-sm">Henüz sohbetin yok.</p>
                    )}
                </div>
            </div>

            {/* ORTA PANEL: Aktif Sohbet Penceresi */}
            <div className="flex-1 flex flex-col">
                {activeChat ? (
                    <>
                        {/* Sohbet Başlığı */}
                        <div className="p-4 bg-gray-700 border-b border-gray-700 shadow-md">
                            <h2 className="text-xl font-semibold text-gray-50">{activeChat.name}</h2>
                            <p className="text-sm text-gray-400">{activeChat.type === 'group' ? `${activeChat.members.length} Üye` : 'Özel Sohbet'}</p>
                        </div>

                        {/* Mesaj Akışı (Placeholder) */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-900/60">
                            {/* Mesajlar buraya gelecek */}
                            <p className="text-gray-500 text-center mt-10">Sohbete başlamak için bir mesaj yazın.</p>
                        </div>

                        {/* Mesaj Gönderme Alanı (Placeholder) */}
                        <div className="p-4 bg-gray-700 border-t border-gray-700">
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Mesajınızı buraya yazın..."
                                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 mr-2"
                                />
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150">
                                    Gönder
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center flex-1 text-gray-500 text-xl">
                        Bir sohbet seçin veya yeni bir sohbet başlatın.
                    </div>
                )}
            </div>
        </div>
    );
}