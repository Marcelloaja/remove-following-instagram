'use client';

import React from 'react';
import { X, ExternalLink, Download, FileJson, CheckCircle2 } from 'lucide-react';

interface InstagramGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstagramGuideModal: React.FC<InstagramGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Cara Download File Data Instagram</h3>
              <p className="text-xs text-slate-500">Resmi dari Pusat Akun Meta (Waktu: 1–3 Menit)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2">
            <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-600" />
            <div>
              <strong>Link Langsung:</strong> Buka halaman ekspor Meta di{' '}
              <a
                href="https://accountscenter.instagram.com/info_and_permissions/dyi/"
                target="_blank"
                rel="noreferrer"
                className="underline font-semibold text-blue-700 hover:text-blue-900"
              >
                accountscenter.instagram.com/info_and_permissions/dyi/
              </a>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="flex gap-2.5">
              <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                1
              </div>
              <div>
                <p className="font-semibold text-slate-900">Buka Menu Unduh Informasi Meta</p>
                <p className="text-slate-500 mt-0.5">
                  Buka profil Instagram Anda &rarr; <strong>Pengaturan</strong> &rarr; <strong>Pusat Akun</strong> &rarr; <strong>Informasi dan izin Anda</strong> &rarr; <strong>Unduh informasi Anda</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                2
              </div>
              <div>
                <p className="font-semibold text-slate-900">Pilih "Unduh atau transfer informasi"</p>
                <p className="text-slate-500 mt-0.5">
                  Pilih akun Instagram Anda &rarr; pilih <strong>"Sebagian informasi"</strong> agar prosesnya cepat.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                3
              </div>
              <div>
                <p className="font-semibold text-slate-900">Centang "Pengikut dan Mengikuti"</p>
                <p className="text-slate-500 mt-0.5">
                  Scroll ke bawah dan centang kategori <strong>"Pengikut dan mengikuti" (Followers and following)</strong> saja.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                4
              </div>
              <div>
                <p className="font-semibold text-slate-900">Pengaturan Format (PENTING)</p>
                <div className="mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <FileJson className="w-3.5 h-3.5 text-slate-600" />
                    <span>Format: <strong>JSON</strong> (jangan pilih HTML)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Rentang Tanggal: <strong>Sepanjang Waktu (All time)</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                5
              </div>
              <div>
                <p className="font-semibold text-slate-900">Buat File & Upload ke Sini</p>
                <p className="text-slate-500 mt-0.5">
                  Klik <strong>"Buat file"</strong>. Dalam 1–3 menit, Meta akan mengirimkan email / notifikasi file unduhan `.zip`. Unduh file tersebut dan seret langsung ke website ini.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <a
            href="https://accountscenter.instagram.com/info_and_permissions/dyi/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-medium"
          >
            Buka Pusat Akun Meta <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
