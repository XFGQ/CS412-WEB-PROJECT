import Link from "next/link";
import { registerAction } from "@/actions";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 py-12 px-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-emerald-400">Aramıza Katıl 🚀</h2>
          <p className="mt-2 text-sm text-slate-400">Hedeflerine ulaşmak için profilini oluştur.</p>
        </div>

        <form action={registerAction} className="mt-8 space-y-4">
          
          {/* Ad Soyad */}
          <div>
            <label className="text-xs font-medium text-slate-300 ml-1">Ad Soyad</label>
            <input name="fullName" required type="text" className="w-full mt-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-emerald-500 outline-none text-slate-200" placeholder="Kayra Can" />
          </div>

          {/* Email */}
          <div>
             <label className="text-xs font-medium text-slate-300 ml-1">Email</label>
             <input name="email" required type="email" className="w-full mt-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-emerald-500 outline-none text-slate-200" placeholder="mail@site.com" />
          </div>

          {/* Fiziksel Özellikler (2'li Grid) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 ml-1">Yaş</label>
              <input name="age" required type="number" className="w-full mt-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-emerald-500 outline-none text-slate-200" placeholder="22" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 ml-1">Boy (cm)</label>
              <input name="height" required type="number" className="w-full mt-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-emerald-500 outline-none text-slate-200" placeholder="180" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="text-xs font-medium text-slate-300 ml-1">Mevcut Kilo (kg)</label>
              <input name="weight" required type="number" className="w-full mt-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-emerald-500 outline-none text-slate-200" placeholder="75" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 ml-1">Hedef Kilo (kg)</label>
              <input name="goalWeight" required type="number" className="w-full mt-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-emerald-500 outline-none text-slate-200" placeholder="70" />
            </div>
          </div>

          {/* Şifre */}
          <div>
            <label className="text-xs font-medium text-slate-300 ml-1">Şifre Belirle</label>
            <input name="password" required type="password" className="w-full mt-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-emerald-500 outline-none text-slate-200" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-[1.02] mt-2">
            Kaydı Tamamla
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Zaten hesabın var mı?{" "}
          <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}