'use client';

import React from 'react';
import { Copy, X, ArrowRight, Play } from 'lucide-react';

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
  onOpenAutoUnfollow,
  onClearSelection,
  onCopySelected,
  onSelectQuick,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl animate-in slide-in-from-bottom-3 duration-200">
      <div className="bg-slate-900 text-white rounded-2xl px-4 py-3 shadow-xl flex items-center justify-between gap-3">
        {/* Left: Selected count & Quick pick */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-white/10 text-white font-bold text-xs flex items-center justify-center">
              {selectedCount}
            </span>
            <span className="text-xs font-medium text-slate-200">Terpilih</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 border-l border-white/15 pl-3">
            <button
              onClick={() => onSelectQuick(10)}
              className="px-2 py-0.5 text-[11px] font-medium bg-white/10 hover:bg-white/20 text-slate-200 rounded transition-colors cursor-pointer"
            >
              +10
            </button>
            <button
              onClick={() => onSelectQuick(25)}
              className="px-2 py-0.5 text-[11px] font-medium bg-white/10 hover:bg-white/20 text-slate-200 rounded transition-colors cursor-pointer"
            >
              +25
            </button>
            <button
              onClick={() => onSelectQuick(50)}
              className="px-2 py-0.5 text-[11px] font-medium bg-white/10 hover:bg-white/20 text-slate-200 rounded transition-colors cursor-pointer"
            >
              +50
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCopySelected}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Salin daftar username"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={onClearSelection}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Batal pilih semua"
          >
            <X className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAutoUnfollow}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer shadow-xs ml-1"
          >
            <Play className="w-3.5 h-3.5 fill-slate-900" />
            <span>Mulai Unfollow</span>
          </button>
        </div>
      </div>
    </div>
  );
};
