'use client';

import React from 'react';
import { X, ExternalLink, Download, FileJson, CheckCircle2, AlertTriangle } from 'lucide-react';

interface InstagramGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstagramGuideModal: React.FC<InstagramGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Panduan Download Data Instagram Resmi</h3>
              <p className="text-xs text-zinc-400">100% Resmi dari Meta • Bebas Risiko Banned • Waktu: ~1-3 Menit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-zinc-300">
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-start gap-2.5">
            <ExternalLink className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <strong>Jalan Pintas Cepat:</strong> Anda bisa langsung buka tautan resmi Meta ini:{' '}
              <a
                href="https://accountscenter.instagram.com/info_and_permissions/dyi/"
                target="_blank"
                rel="noreferrer"
                className="underline font-semibold text-blue-400 hover:text-blue-300"
              >
                accountscenter.instagram.com/info_and_permissions/dyi/
              </a>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm">Langkah-langkah Mudah:</h4>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1">
                <p className="text-zinc-200 font-medium">Buka Menu Unduh Informasi Meta</p>
                <p className="text-xs text-zinc-400">
                  Di aplikasi Instagram atau browser, buka profil Anda &rarr; <strong>Pengaturan & Aktivitas</strong> &rarr; <strong>Pusat Akun Meta</strong> &rarr; <strong>Informasi dan izin Anda</strong> &rarr; <strong>Unduh informasi Anda</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1">
                <p className="text-zinc-200 font-medium">Pilih "Unduh atau transfer informasi"</p>
                <p className="text-xs text-zinc-400">
                  Pilih akun Instagram Anda &rarr; Pilih opsi <strong>"Sebagian informasi"</strong> (agar cepat selesai).
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1">
                <p className="text-zinc-200 font-medium">Centang Hanya "Pengikut dan Mengikuti"</p>
                <p className="text-xs text-zinc-400">
                  Scroll ke bawah dan centang kategori <strong>"Pengikut dan mengikuti"</strong> (Followers and following). Klik Selanjutnya.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-1">
                <p className="text-zinc-200 font-medium">Pengaturan Format (Penting!)</p>
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-xs space-y-1.5 mt-1">
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-emerald-400" />
                    <span>Format: <strong>JSON</strong> (bukan HTML, agar data akurat)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Rentang Tanggal: <strong>Sepanjang Waktu (All time)</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                5
              </div>
              <div className="space-y-1">
                <p className="text-zinc-200 font-medium">Klik "Buat File" & Tunggu Email/Notifikasi</p>
                <p className="text-xs text-zinc-400">
                  Karena hanya data follow yang diunduh, prosesnya biasanya sangat cepat (sekitar 1-3 menit). Setelah file zip selesai disiapkan Meta, klik Unduh lalu seret (drag & drop) file .zip tersebut ke website ini!
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <strong>Kenapa metode ini paling aman di dunia?</strong><br />
              Instagram memberlakukan ban ketat pada website pihak ketiga yang meminta password secara paksa. Dengan metode ekspor resmi Meta ini, akun Anda 100% aman, tidak akan pernah terkena checkpoint/banned, dan Anda tidak perlu menyerahkan password sama sekali!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex justify-between items-center">
          <a
            href="https://accountscenter.instagram.com/info_and_permissions/dyi/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium"
          >
            Buka Pusat Akun Meta <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};

