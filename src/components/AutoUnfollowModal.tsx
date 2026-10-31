'use client';

import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ShieldAlert, Sparkles, Sliders, Play, Code } from 'lucide-react';
import { generateUnfollowScript, generateBookmarkletUrl } from '@/utils/unfollowScript';

interface AutoUnfollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUsernames: string[];
  onMarkUnfollowed?: (usernames: string[]) => void;
}

export const AutoUnfollowModal: React.FC<AutoUnfollowModalProps> = ({
  isOpen,
  onClose,
  selectedUsernames,
  onMarkUnfollowed,
}) => {
  const [delaySeconds, setDelaySeconds] = useState(8);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedList, setCopiedList] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookmarklet' | 'console' | 'manual'>('bookmarklet');

  if (!isOpen) return null;

  const script = generateUnfollowScript(selectedUsernames, delaySeconds);
  const bookmarkletUrl = generateBookmarkletUrl(script);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleCopyList = () => {
    navigator.clipboard.writeText(selectedUsernames.join('\n'));
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Smart In-Browser Auto-Unfollower</h3>
              <p className="text-xs text-zinc-400">
                {selectedUsernames.length} akun siap diproses langsung di browser Anda secara aman
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Safety Delay Slider */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span className="font-medium text-white text-xs">Jeda Keamanan Antar Unfollow:</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {delaySeconds} Detik (+ acak 1-4s)
              </span>
            </div>

            <input
              type="range"
              min={5}
              max={20}
              step={1}
              value={delaySeconds}
              onChange={(e) => setDelaySeconds(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />

            <div className="flex justify-between text-[11px] text-zinc-500">
              <span>5s (Cepat)</span>
              <span className="text-emerald-400 font-medium">8s - 12s (Rekomendasi Aman)</span>
              <span>20s (Sangat Aman)</span>
            </div>
          </div>

          {/* Execution Tabs */}
          <div>
            <div className="flex border-b border-zinc-800 mb-4">
              <button
                onClick={() => setActiveTab('bookmarklet')}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
                  activeTab === 'bookmarklet'
                    ? 'border-rose-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-300'
                }`}
              >
                <Play className="w-3.5 h-3.5 text-rose-400" />
                <span>Metode 1: Bookmarklet (Praktis)</span>
              </button>

              <button
                onClick={() => setActiveTab('console')}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
                  activeTab === 'console'
                    ? 'border-purple-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-300'
                }`}
              >
                <Code className="w-3.5 h-3.5 text-purple-400" />
                <span>Metode 2: Console Script (F12)</span>
              </button>

              <button
                onClick={() => setActiveTab('manual')}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
                  activeTab === 'manual'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-300'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span>Metode 3: Buka Link Manual</span>
              </button>
            </div>

            {/* TAB 1: Bookmarklet */}
            {activeTab === 'bookmarklet' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 via-purple-500/5 to-transparent border border-rose-500/20 text-center">
                  <p className="text-xs text-zinc-300 mb-3">
                    Seret tombol di bawah ini ke <strong>Bookmarks Bar (Bilah Bookmark)</strong> browser Anda:
                  </p>

                  <a
                    href={bookmarkletUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Jangan diklik di sini! Seret (drag & drop) tombol ini ke Bilah Bookmark browser Anda, atau gunakan Tab "Console Script" untuk copy-paste.');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 cursor-grab active:cursor-grabbing border border-rose-400/30"
                  >
                    <span>⚡ Auto Unfollow ({selectedUsernames.length} Akun)</span>
                  </a>

                  <p className="text-[11px] text-zinc-500 mt-3">
                    (Jika bookmark bar belum muncul di Chrome/Edge, tekan <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300">Ctrl + Shift + B</kbd>)
                  </p>
                </div>

                <ol className="text-xs text-zinc-300 space-y-2 list-decimal list-inside bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <li>Seret tombol di atas ke bilah bookmark Anda.</li>
                  <li>Buka tab <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="text-rose-400 underline">instagram.com</a> (pastikan sudah login).</li>
                  <li>Klik bookmark yang baru saja Anda tambahkan.</li>
                  <li>Widget mini akan muncul di pojok kanan bawah Instagram Anda untuk memproses unfollow dengan jeda waktu otomatis!</li>
                </ol>
              </div>
            )}

            {/* TAB 2: Console Script */}
            {activeTab === 'console' && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-400">
                  Salin script di bawah ini, lalu jalankan di tab <code className="text-rose-400">instagram.com</code> melalui tab Console (F12).
                </p>

                <div className="relative">
                  <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[11px] text-zinc-300 font-mono max-h-36 overflow-y-auto">
                    {script}
                  </pre>
                  <button
                    onClick={handleCopyScript}
                    className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 shadow"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Script</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-xs text-zinc-300 space-y-1.5">
                  <div className="font-semibold text-white">Cara Jalankan di Browser:</div>
                  <p>1. Buka <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="text-rose-400 underline font-medium">instagram.com</a>.</p>
                  <p>2. Tekan <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300">F12</kbd> di keyboard (atau klik kanan &rarr; Inspect).</p>
                  <p>3. Klik tab <strong>Console</strong>, lalu tempel (Paste) script tadi dan tekan <strong>Enter</strong>.</p>
                </div>
              </div>
            )}

            {/* TAB 3: Manual Links */}
            {activeTab === 'manual' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-400">
                    Buka profil target secara berurutan untuk unfollow manual dalam 1-klik:
                  </p>
                  <button
                    onClick={handleCopyList}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    {copiedList ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedList ? 'Tersalin' : 'Salin Semua Username'}</span>
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {selectedUsernames.map((username) => (
                    <div
                      key={username}
                      className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs"
                    >
                      <span className="font-medium text-zinc-200">@{username}</span>
                      <a
                        href={`https://www.instagram.com/${username}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                      >
                        <span>Buka Profil</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Safety Notice */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <strong>Batas Aman Instagram:</strong> Disarankan unfollow maksimal <strong>30-50 akun per sesi</strong>. Beri jeda 1-2 jam sebelum melakukan batch berikutnya untuk menjaga reputasi akun Anda dari sistem bot detection Instagram.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex justify-between items-center">
          {onMarkUnfollowed && (
            <button
              onClick={() => {
                onMarkUnfollowed(selectedUsernames);
                onClose();
              }}
              className="text-xs text-zinc-400 hover:text-emerald-400 font-medium"
            >
              ✓ Tandai Akun Ini Sebagai Selesai
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-all ml-auto"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

