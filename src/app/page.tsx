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
import { ShieldCheck, Zap, Heart, CheckCircle2, AlertCircle } from 'lucide-react';

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
    showToast(`Berhasil memuat ${result.following.length} following & ${result.followers.length} followers!`);
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
    showToast(`${selectedUsernames.length} username berhasil disalin!`);
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
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-zinc-900 border border-zinc-700 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onReset={handleReset}
        hasData={Boolean(data)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {!data ? (
          /* Empty State / Upload Mode */
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Hero Banner */}
            <div className="text-center max-w-2xl mx-auto pt-4 pb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4">
                <Zap className="w-3.5 h-3.5" />
                <span>Solusi Cerdas & Aman Bersihkan Following Instagram</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Cek Siapa yang <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 bg-clip-text text-transparent">Tidak Follback</span> Kamu
              </h1>
              <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
                Temukan akun yang tidak mengikuti balik dengan 100% akurat. Pilih akun yang ingin dihapus, lalu gunakan fitur <strong>Smart Auto-Unfollow</strong> ber-jeda aman langsung dari browser Anda tanpa risiko kena ban!
              </p>
            </div>

            {/* Privacy Shield Info */}
            <PrivacyBanner />

            {/* Drag & Drop File Uploader */}
            <FileUploader
              onParsed={handleParsed}
              onOpenGuide={() => setIsGuideOpen(true)}
            />

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80">
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-white text-sm">Privasi & Anti Phishing</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Tidak pernah ada form login password Instagram. Data diekstrak langsung di perangkat Anda tanpa lewat server kami.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-white text-sm">Auto-Unfollow Berjeda</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Gunakan bookmarklet atau script otomatis yang dilengkapi jeda acak (8-15 detik) untuk menghindari peringatan spam dari Instagram.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-white text-sm">Proteksi Whitelist</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Tandai akun artis, teman dekat, atau idola Anda sebagai Whitelist agar terlindungi dan tidak akan ikut ter-unfollow.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Data Dashboard Mode */
          <div className="space-y-6 animate-in fade-in duration-300">
            <UserTable
              data={data}
              onOpenAutoUnfollow={handleOpenAutoUnfollow}
              selectedUsernames={selectedUsernames}
              setSelectedUsernames={setSelectedUsernames}
            />

            {/* Bottom Floating Action Bar */}
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

      {/* Auto Unfollow Modal */}
      <AutoUnfollowModal
        isOpen={isAutoUnfollowOpen}
        onClose={() => setIsAutoUnfollowOpen(false)}
        selectedUsernames={selectedUsernames}
        onMarkUnfollowed={handleMarkUnfollowed}
      />

      {/* Official Guide Modal */}
      <InstagramGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <p>
          Dibuat dengan privasi nomor satu. Tidak berafiliasi dengan Instagram atau Meta Platforms, Inc.
        </p>
      </footer>
    </div>
  );
}
