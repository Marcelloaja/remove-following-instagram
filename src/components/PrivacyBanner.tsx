'use client';

import React from 'react';
import { ShieldCheck, Lock, HardDrive, Ban } from 'lucide-react';

export const PrivacyBanner: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">
              Keamanan Akun & Privasi Terjamin
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5 max-w-2xl leading-relaxed">
              Website ini berjalan murni di peramban (browser) Anda. Tidak ada username, password, atau file data Anda yang dikirim ke server backend mana pun.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-medium">Tanpa Password</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <HardDrive className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-medium">Lokal Browser</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <Ban className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-medium">Anti Checkpoint</span>
          </div>
        </div>
      </div>
    </div>
  );
};
