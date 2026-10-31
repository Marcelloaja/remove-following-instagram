'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { PrivacyBanner } from '@/components/PrivacyBanner';
import { FileUploader } from '@/components/FileUploader';
import { UserTable } from '@/components/UserTable';
import { AutoUnfollowModal } from '@/components/AutoUnfollowModal';
import { InstagramGuideModal } from '@/components/InstagramGuideModal';
import { BatchActionBar } from '@/components/BatchActionBar';
import { ParseResult } from '@/types/instagram';
import { ShieldCheck, CheckCircle2, Clock, Star } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<ParseResult | null>(null);
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAutoUnfollowOpen, setIsAutoUnfollowOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleParsed = (result: ParseResult) => {
    setData(result);
    setSelectedUsernames([]);
    showToast(`Berhasil memuat ${result.following.length} following & ${result.followers.length} followers`);
  };

  const handleReset = () => {
    setData(null);
    setSelectedUsernames([]);
  };

  const handleOpenAutoUnfollow = () => {
    if (selectedUsernames.length === 0) {
      showToast('Pilih setidaknya 1 akun untuk di-unfollow.');
      return;
    }
    setIsAutoUnfollowOpen(true);
  };

  const handleCopySelected = () => {
    navigator.clipboard.writeText(selectedUsernames.join('\n'));
    showToast(`${selectedUsernames.length} username berhasil disalin ke clipboard!`);
  };

  const handleSelectQuick = (count: number) => {
    if (!data) return;
    const targets = data.notFollowingBack.slice(0, count).map((u) => u.username);
    setSelectedUsernames(targets);
  };

  const handleMarkUnfollowed = (usernames: string[]) => {
    showToast(`${usernames.length} akun ditandai selesai!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-white border border-slate-200 text-slate-900 px-4 py-2.5 rounded-xl shadow-lg text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onReset={handleReset}
        hasData={Boolean(data)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {!data ? (
          /* Empty State / Upload Mode */
          <div className="space-y-6">
            {/* Clean Hero Title */}
            <div className="text-center max-w-xl mx-auto pt-4 pb-2">
              <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200/70 text-slate-700 mb-3">
                Instagram Following Manager
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Cek Akun yang Tidak Follback
              </h1>
              <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
                Bandingkan daftar pengikut dan yang Anda ikuti secara aman dari file ekspor resmi Meta tanpa perlu memasukkan password akun.
              </p>
            </div>

            {/* Privacy Guarantee Banner */}
            <PrivacyBanner />

            {/* Upload Zone */}
            <FileUploader
              onParsed={handleParsed}
              onOpenGuide={() => setIsGuideOpen(true)}
            />

            {/* Simple Clean Functional Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-2.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-xs text-slate-900">Tanpa Password</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Tidak ada risiko akun terkena checkpoint atau banned karena data diproses langsung di browser Anda.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-2.5">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-xs text-slate-900">Jeda Otomatis Aman</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Fitur unfollow dilengkapi jeda acak (8–15 detik) untuk menghindari deteksi spam dan batasan HTTP 429.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-2.5">
                  <Star className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-xs text-slate-900">Proteksi Whitelist</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Tandai akun artis, keluarga, atau teman dekat agar terlindungi dan tidak sengaja terhapus.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Data Dashboard Mode */
          <div className="space-y-6">
            <UserTable
              data={data}
              onOpenAutoUnfollow={handleOpenAutoUnfollow}
              selectedUsernames={selectedUsernames}
              setSelectedUsernames={setSelectedUsernames}
            />

            {/* Floating Action Bar */}
            <BatchActionBar
              selectedCount={selectedUsernames.length}
              totalVisible={data.notFollowingBack.length}
              onOpenAutoUnfollow={handleOpenAutoUnfollow}
              onClearSelection={() => setSelectedUsernames([])}
              onCopySelected={handleCopySelected}
              onSelectQuick={handleSelectQuick}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <AutoUnfollowModal
        isOpen={isAutoUnfollowOpen}
        onClose={() => setIsAutoUnfollowOpen(false)}
        selectedUsernames={selectedUsernames}
        onMarkUnfollowed={handleMarkUnfollowed}
      />

      <InstagramGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        <p>
          Alat bantu mandiri untuk pengelolaan following Instagram. Tidak berafiliasi dengan Instagram atau Meta.
        </p>
      </footer>
    </div>
  );
}
