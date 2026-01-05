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
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) redirect("/login");

  const user = await db.select().from(users).where(eq(users.id, Number(userId))).get();
  
  if (!user) redirect("/login");

  // User initials for profile picture
  const initials = user.fullName ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      
      {/* --- 1. LEFT SIDEBAR (FIXED MENU) --- */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
              FitTrack
            </span>
            <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">PRO</span>
          </div>

          {/* Menu Links */}
          <nav className="p-4 space-y-1">
            <SidebarItem href="/" icon="🏠" text="Overview" />
            <SidebarItem href="/workouts" icon="💪" text="Workouts" />
            <SidebarItem href="/nutrition" icon="🥗" text="Nutrition" />
            <SidebarItem href="/stats" icon="📈" text="Reports" />
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Support</p>
            </div>
            <SidebarItem href="/workouts/guide" icon="📚" text="Exercise Guide" />
            <SidebarItem href="/settings" icon="⚙️" text="Settings" />
          </nav>
        </div>

        {/* Bottom Profile Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-900/20">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- 2. RIGHT CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* --- TOP HEADER (TOP BAR) --- */}
        <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-10 sticky top-0">
          {/* Mobile Menu Button (Visible on mobile only) */}
          <button className="md:hidden text-slate-400 text-xl">☰</button>
          
          {/* Date Info */}
          <div className="hidden md:block text-slate-400 text-sm">
            Today: <span className="text-slate-200 font-medium">{new Date().toLocaleDateString('en-US')}</span>
          </div>

          {/* Right Corner Actions */}
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              🔔
            </button>
            <div className="h-8 w-[1px] bg-slate-800"></div>
             <span className="text-sm text-slate-300">Welcome, <span className="text-emerald-400 font-semibold">{user.fullName.split(' ')[0]}</span></span>
          </div>
        </header>

        {/* --- SCROLLABLE MAIN CONTENT --- */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ href, icon, text }: { href: string, icon: string, text: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group"
    >
      <span className="text-lg opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">{icon}</span>
      <span className="font-medium text-sm">{text}</span>
    </Link>
  );
}