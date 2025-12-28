import Link from "next/link";
import { loginAction } from "../../../actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-emerald-400 tracking-tight">FitTrack Pro</h2>
          <p className="mt-2 text-sm text-slate-400">Devam etmek için giriş yapın.</p>
        </div>
        
        {/* Form action'ı bağlandı */}
        <form action={loginAction} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-slate-300">Email Adresi</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full mt-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-200"
                placeholder="test@test.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-300">Şifre</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full mt-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            Giriş Yap
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          <Link href="/register" className="font-medium text-emerald-400 hover:text-emerald-300">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}