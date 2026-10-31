'use client';

import React from 'react';
import { Sparkles, Copy, X, CheckSquare } from 'lucide-react';

interface BatchActionBarProps {
  selectedCount: number;
  totalVisible: number;
  onOpenAutoUnfollow: () => void;
  onClearSelection: () => void;
  onCopySelected: () => void;
  onSelectQuick: (count: number) => void;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  totalVisible,
  onOpenAutoUnfollow,
  onClearSelection,
  onCopySelected,
  onSelectQuick,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/80 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Info & Quick selector */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center">
              {selectedCount}
            </span>
            <span className="text-xs font-semibold text-white">Akun Dipilih</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectQuick(10)}
              className="px-2 py-1 text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
            >
              +10
            </button>
            <button
              onClick={() => onSelectQuick(25)}
              className="px-2 py-1 text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
            >
              +25
            </button>
            <button
              onClick={() => onSelectQuick(50)}
              className="px-2 py-1 text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
            >
              +50
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onCopySelected}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-medium transition-all"
            title="Salin daftar username"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salin</span>
          </button>

          <button
            onClick={onClearSelection}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all"
            title="Batal Pilih"
          >
            <X className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAutoUnfollow}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>⚡ Jalankan Auto-Unfollow</span>
          </button>
        </div>
      </div>
    </div>
  );
};

