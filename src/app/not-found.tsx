import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md text-center relative z-10 glass-card p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono text-xs mb-3">
          HTTP 404 - NOT FOUND
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-xs text-slate-400 font-mono leading-relaxed mb-6">
          Halaman yang Anda cari tidak tersedia, telah dipindahkan, atau Anda tidak memiliki akses ke alamat ini.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-mono text-xs border border-slate-800 hover:border-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}
