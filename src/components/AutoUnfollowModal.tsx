'use client';

import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ShieldAlert, Sliders, Play, Code } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'console' | 'bookmarklet' | 'manual'>('console');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">
              Mulai Unfollow ({selectedUsernames.length} Akun Dipilih)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Diproses langsung dari tab Instagram Anda dengan jeda aman.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Large Batch Warning */}
          {selectedUsernames.length > 50 && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
              <div>
                <strong>Perhatian ({selectedUsernames.length} akun):</strong> Instagram membatasi aktivitas jika melakukan lebih dari 50 akun sekaligus (error 429). Sangat disarankan cicil <strong>25–50 akun per sesi</strong> lalu beri jeda 1 jam.
              </div>
            </div>
          )}

          {/* Delay Slider */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Jeda antar unfollow:</span>
              </div>
              <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {delaySeconds} detik (+ acak 1-4s)
              </span>
            </div>

            <input
              type="range"
              min={5}
              max={20}
              step={1}
              value={delaySeconds}
              onChange={(e) => setDelaySeconds(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>5s (Cepat)</span>
              <span className="text-emerald-700 font-medium">8s - 12s (Disarankan)</span>
              <span>20s (Sangat Aman)</span>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex border-b border-slate-200 mb-3">
              <button
                onClick={() => setActiveTab('console')}
                className={`flex items-center gap-1.5 pb-2 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'console'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Cara 1: Console Script (Paling Pasti)</span>
              </button>

              <button
                onClick={() => setActiveTab('bookmarklet')}
                className={`flex items-center gap-1.5 pb-2 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'bookmarklet'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Cara 2: Bookmarklet</span>
              </button>

              <button
                onClick={() => setActiveTab('manual')}
                className={`flex items-center gap-1.5 pb-2 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'manual'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Cara 3: Manual</span>
              </button>
            </div>

            {/* TAB 1: Console */}
            {activeTab === 'console' && (
              <div className="space-y-3">
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 rounded-xl p-3 text-[11px] font-mono max-h-32 overflow-y-auto">
                    {script}
                  </pre>
                  <button
                    onClick={handleCopyScript}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded bg-white/20 hover:bg-white/30 text-white font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin Script</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700 space-y-1.5">
                  <div className="font-semibold text-slate-900">Cara Menjalankan:</div>
                  <p>1. Buka tab <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="text-slate-900 underline font-medium">instagram.com</a> tempat Anda sudah login.</p>
                  <p>2. Tekan <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-800 font-mono">F12</kbd> di keyboard &rarr; klik tab <strong>Console</strong>.</p>
                  <p>3. Jika muncul larangan paste, ketik <code className="bg-slate-200 px-1 rounded font-mono text-slate-900">allow pasting</code> lalu tekan Enter.</p>
                  <p>4. Tekan <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-800 font-mono">Ctrl + V</kbd> (Paste) dan tekan <strong>Enter</strong>.</p>
                </div>
              </div>
            )}

            {/* TAB 2: Bookmarklet */}
            {activeTab === 'bookmarklet' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-xs text-slate-600 mb-3">
                    Seret (drag & drop) tombol di bawah ini ke <strong>Bilah Bookmark (Bookmarks Bar)</strong>:
                  </p>

                  <a
                    href={bookmarkletUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Jangan klik di sini. Seret tombol ini ke Bilah Bookmark browser Anda!');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-black text-white font-semibold text-xs cursor-grab active:cursor-grabbing shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Auto Unfollow ({selectedUsernames.length})</span>
                  </a>

                  <p className="text-[11px] text-slate-400 mt-2">
                    Buka Bilah Bookmark di Chrome: tekan <kbd className="px-1 py-0.5 bg-slate-200 rounded text-slate-700">Ctrl + Shift + B</kbd>
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 space-y-1">
                  <p>Setelah bookmark disimpan, buka tab <code className="text-slate-900">instagram.com</code> dan cukup klik bookmark tersebut.</p>
                </div>
              </div>
            )}

            {/* TAB 3: Manual */}
            {activeTab === 'manual' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Buka profil langsung satu per satu:</span>
                  <button
                    onClick={handleCopyList}
                    className="text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    {copiedList ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedList ? 'Tersalin' : 'Salin Semua Username'}</span>
                  </button>
                </div>

                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                  {selectedUsernames.map((username) => (
                    <div
                      key={username}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200"
                    >
                      <span className="font-medium text-slate-800">@{username}</span>
                      <a
                        href={`https://www.instagram.com/${username}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:text-slate-900"
                      >
                        <span>Buka</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {onMarkUnfollowed && (
            <button
              onClick={() => {
                onMarkUnfollowed(selectedUsernames);
                onClose();
              }}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              Tandai akun ini sudah selesai
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium transition-colors cursor-pointer ml-auto"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
