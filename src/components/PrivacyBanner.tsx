'use client';

import React from 'react';
import { ShieldCheck, Lock, EyeOff, Zap } from 'lucide-react';

export const PrivacyBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-900/90 border border-zinc-800 p-5 sm:p-6 mb-8">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              Privasi 100% Terjaga & Tanpa Risiko Banned Akun
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Website ini <strong>TIDAK PERNAH</strong> meminta password atau login akun Instagram Anda. Semua proses perbandingan data dilakukan 100% langsung di browser perangkat Anda tanpa data dikirim ke server mana pun.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
          <div className="flex flex-col items-center text-center p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <Lock className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-[11px] font-medium text-zinc-300">Tanpa Password</span>
          </div>
          <div className="flex flex-col items-center text-center p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <EyeOff className="w-4 h-4 text-purple-400 mb-1" />
            <span className="text-[11px] font-medium text-zinc-300">Data Privat</span>
          </div>
          <div className="flex flex-col items-center text-center p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <Zap className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[11px] font-medium text-zinc-300">Bebas Banned</span>
          </div>
        </div>
      </div>
    </div>
  );
};

