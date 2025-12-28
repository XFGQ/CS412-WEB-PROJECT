import Link from "next/link";
import { db } from "../../../db";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Giriş yapan kullanıcının ID'sini çerezden al
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  // Eğer giriş yapılmamışsa login'e at (Güvenlik önlemi)
  if (!userId) {
    redirect("/login");
  }

  // 2. Bu ID'ye sahip kullanıcıyı veritabanından bul
  const user = await db.select().from(users).where(eq(users.id, Number(userId))).get();

  // Kullanıcı bulunamazsa çıkış yap
  if (!user) {
    redirect("/login");
  }

  // İsimden baş harfleri alma (Örn: Kayra Can -> KC)
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* --- SOL SIDEBAR --- */}
      <aside className="w-64 hidden md:flex flex-col border-r border-slate-800 bg-slate-900 fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
            FitTrack Pro
          </span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6">
          <SidebarItem href="/" icon="📊" text="Genel Bakış" />
          <SidebarItem href="/workouts" icon="💪" text="Antrenmanlarım" />
          <SidebarItem href="/nutrition" icon="🍎" text="Beslenme Takibi" />
          <SidebarItem href="/workouts/guide" icon="📚" text="Egzersiz Rehberi" />
          <SidebarItem href="/stats" icon="📈" text="İstatistikler" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-4">
             <p className="text-xs text-slate-400 mb-2">Haftalık Hedef</p>
             <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 w-[70%] h-full"></div>
             </div>
          </div>
        </div>
      </aside>

      {/* --- SAĞ TARAFTAKİ ANA ALAN --- */}
      <div className="flex-1 md:ml-64 flex flex-col">
        
        {/* --- ÜST HEADER (TOP BAR) - DİNAMİK İSİM BURADA --- */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10 flex items-center justify-between px-8">
          {/* Mobil Menü İkonu (Görsel olarak) */}
          <div className="md:hidden text-slate-400">☰</div> 

          {/* Sağ Taraftaki Kullanıcı Alanı */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white">{user.fullName}</p>
              <p className="text-xs text-emerald-400">Pro Üye</p>
            </div>
            
            {/* Profil Resmi (Avatar) */}
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[2px]">
              <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-sm font-bold text-emerald-400">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* --- SAYFA İÇERİĞİ --- */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// Sidebar Link Bileşeni
function SidebarItem({ href, icon, text }: { href: string, icon: string, text: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-all duration-200 hover:pl-6 group"
    >
      <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-medium">{text}</span>
    </Link>
  );
}