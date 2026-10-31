'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ArrowUpDown,
  UserX,
  Users,
  HeartHandshake,
  Shield,
  Star,
  ExternalLink,
  Check,
  CheckSquare,
  Square,
  Sparkles,
  Download,
} from 'lucide-react';
import { InstagramUser, ParseResult, TabType } from '@/types/instagram';

interface UserTableProps {
  data: ParseResult;
  onOpenAutoUnfollow: (selected: string[]) => void;
  selectedUsernames: string[];
  setSelectedUsernames: React.Dispatch<React.SetStateAction<string[]>>;
}

export const UserTable: React.FC<UserTableProps> = ({
  data,
  onOpenAutoUnfollow,
  selectedUsernames,
  setSelectedUsernames,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('notFollowingBack');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'alpha-asc' | 'alpha-desc'>('date-desc');
  const [whitelist, setWhitelist] = useState<Set<string>>(new Set());
  const [hideWhitelisted, setHideWhitelisted] = useState(true);
  const [pageSize, setPageSize] = useState(50);
  const [unfollowedLocally, setUnfollowedLocally] = useState<Set<string>>(new Set());

  // Load Whitelist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ig_unfoll_whitelist');
      if (saved) {
        setWhitelist(new Set(JSON.parse(saved)));
      }
    } catch (e) {
      console.warn('Gagal membaca whitelist dari localStorage', e);
    }
  }, []);

  const toggleWhitelist = (username: string) => {
    setWhitelist((prev) => {
      const next = new Set(prev);
      if (next.has(username)) {
        next.delete(username);
      } else {
        next.add(username);
        // Also deselect if whitelisted
        setSelectedUsernames((curr) => curr.filter((u) => u !== username));
      }
      try {
        localStorage.setItem('ig_unfoll_whitelist', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const markAsUnfollowed = (username: string) => {
    setUnfollowedLocally((prev) => {
      const next = new Set(prev);
      next.add(username);
      return next;
    });
    setSelectedUsernames((curr) => curr.filter((u) => u !== username));
  };

  // Base list depending on active tab
  const rawList = useMemo(() => {
    switch (activeTab) {
      case 'notFollowingBack':
        return data.notFollowingBack.filter((u) => !unfollowedLocally.has(u.username));
      case 'fans':
        return data.fans;
      case 'mutuals':
        return data.mutuals;
      case 'whitelist':
        return data.following.filter((u) => whitelist.has(u.username));
      default:
        return [];
    }
  }, [activeTab, data, unfollowedLocally, whitelist]);

  // Filter and sort
  const filteredList = useMemo(() => {
    let list = rawList;

    if (activeTab === 'notFollowingBack' && hideWhitelisted) {
      list = list.filter((u) => !whitelist.has(u.username));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter((u) => u.username.toLowerCase().includes(query));
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'date-desc') {
        return (b.timestamp || 0) - (a.timestamp || 0);
      }
      if (sortBy === 'date-asc') {
        return (a.timestamp || 0) - (b.timestamp || 0);
      }
      if (sortBy === 'alpha-asc') {
        return a.username.localeCompare(b.username);
      }
      if (sortBy === 'alpha-desc') {
        return b.username.localeCompare(a.username);
      }
      return 0;
    });
  }, [rawList, activeTab, hideWhitelisted, whitelist, searchQuery, sortBy]);

  const visibleList = useMemo(() => {
    return filteredList.slice(0, pageSize);
  }, [filteredList, pageSize]);

  // Selection handlers
  const handleToggleSelect = (username: string) => {
    setSelectedUsernames((prev) =>
      prev.includes(username) ? prev.filter((u) => u !== username) : [...prev, username]
    );
  };

  const handleSelectQuick = (count: number) => {
    const candidateUsernames = filteredList
      .filter((u) => !whitelist.has(u.username))
      .slice(0, count)
      .map((u) => u.username);
    
    setSelectedUsernames(candidateUsernames);
  };

  const handleSelectAllVisible = () => {
    const all = visibleList.filter((u) => !whitelist.has(u.username)).map((u) => u.username);
    setSelectedUsernames(all);
  };

  const handleClearSelection = () => {
    setSelectedUsernames([]);
  };

  const handleExportCsv = () => {
    const header = 'Username,Instagram URL,Tanggal Follow\n';
    const rows = filteredList
      .map((u) => `${u.username},${u.url},"${u.followedAtFormatted || '-'}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `instagram_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper avatar background colors based on username string
  const getAvatarGradient = (str: string) => {
    const gradients = [
      'from-rose-500 to-amber-500',
      'from-purple-600 to-indigo-600',
      'from-pink-500 to-rose-600',
      'from-cyan-500 to-blue-600',
      'from-emerald-500 to-teal-600',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
    return gradients[Math.abs(hash) % gradients.length];
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => {
            setActiveTab('notFollowingBack');
            setSelectedUsernames([]);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'notFollowingBack'
              ? 'bg-rose-500/10 border-rose-500/40 shadow-lg shadow-rose-500/10'
              : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-400">Tidak Follback Kamu</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {data.notFollowingBack.length - unfollowedLocally.size}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Akun yang Anda ikuti tapi tidak follback</p>
        </button>

        <button
          onClick={() => {
            setActiveTab('fans');
            setSelectedUsernames([]);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'fans'
              ? 'bg-purple-500/10 border-purple-500/40 shadow-lg shadow-purple-500/10'
              : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-400">Fans (Followers Saja)</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{data.fans.length}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Mereka follow Anda, Anda belum follow</p>
        </button>

        <button
          onClick={() => {
            setActiveTab('mutuals');
            setSelectedUsernames([]);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'mutuals'
              ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
              : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400">Saling Follow (Mutuals)</span>
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{data.mutuals.length}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Teman yang saling mengikuti</p>
        </button>

        <button
          onClick={() => {
            setActiveTab('whitelist');
            setSelectedUsernames([]);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'whitelist'
              ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/10'
              : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400">Dilindungi (Whitelist)</span>
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{whitelist.size}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Akun favorit yang tidak akan di-unfollow</p>
        </button>
      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="date-desc">Tanggal Follow (Terbaru)</option>
                <option value="date-asc">Tanggal Follow (Terlama)</option>
                <option value="alpha-asc">Username (A - Z)</option>
                <option value="alpha-desc">Username (Z - A)</option>
              </select>
            </div>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
              title="Download Data sebagai CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Action & Batch Selectors */}
        {activeTab === 'notFollowingBack' && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80 text-xs">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hideWhitelisted}
                  onChange={(e) => setHideWhitelisted(e.target.checked)}
                  className="rounded border-zinc-700 text-rose-500 focus:ring-0 bg-zinc-950"
                />
                <span className="text-[11px] text-zinc-400">Sembunyikan Akun Whitelist / Dilindungi</span>
              </label>
            </div>

            {/* Quick Batch Select Buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 mr-1">Pilih Cepat:</span>
              <button
                onClick={() => handleSelectQuick(10)}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
              >
                10
              </button>
              <button
                onClick={() => handleSelectQuick(25)}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
              >
                25
              </button>
              <button
                onClick={() => handleSelectQuick(50)}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
              >
                50
              </button>
              <button
                onClick={handleSelectAllVisible}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
              >
                Pilih Semua ({Math.min(filteredList.length, pageSize)})
              </button>
              {selectedUsernames.length > 0 && (
                <button
                  onClick={handleClearSelection}
                  className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors"
                >
                  Batal
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User List */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span>
              Menampilkan <strong className="text-white">{visibleList.length}</strong> dari{' '}
              <strong className="text-white">{filteredList.length}</strong> akun
            </span>
            {selectedUsernames.length > 0 && (
              <span className="text-rose-400 font-semibold">
                ({selectedUsernames.length} dipilih)
              </span>
            )}
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="py-16 text-center text-zinc-500">
            <p className="text-sm">Tidak ada akun yang sesuai dengan kriteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {visibleList.map((user) => {
              const isSelected = selectedUsernames.includes(user.username);
              const isWhitelisted = whitelist.has(user.username);

              return (
                <div
                  key={user.username}
                  className={`flex items-center justify-between p-3.5 sm:p-4 transition-colors ${
                    isSelected
                      ? 'bg-rose-500/10'
                      : 'hover:bg-zinc-800/30'
                  }`}
                >
                  {/* Left: Checkbox, Avatar, Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    {activeTab === 'notFollowingBack' && (
                      <button
                        onClick={() => handleToggleSelect(user.username)}
                        disabled={isWhitelisted}
                        className={`text-zinc-400 hover:text-white transition-colors ${
                          isWhitelisted ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-rose-500" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    )}

                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-tr ${getAvatarGradient(
                        user.username
                      )} flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm shrink-0`}
                    >
                      {user.username.slice(0, 2)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <a
                          href={user.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-xs sm:text-sm text-zinc-100 hover:text-rose-400 transition-colors truncate"
                        >
                          @{user.username}
                        </a>

                        {isWhitelisted && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                            <span>Dilindungi</span>
                          </span>
                        )}
                      </div>

                      {user.followedAtFormatted && (
                        <p className="text-[11px] text-zinc-500">
                          Di-follow: {user.followedAtFormatted}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Whitelist Star Button */}
                    <button
                      onClick={() => toggleWhitelist(user.username)}
                      title={isWhitelisted ? 'Hapus dari Whitelist' : 'Lindungi dari Unfollow (Whitelist)'}
                      className={`p-2 rounded-lg transition-colors ${
                        isWhitelisted
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'text-zinc-500 hover:text-amber-400 hover:bg-zinc-800'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isWhitelisted ? 'fill-amber-400' : ''}`} />
                    </button>

                    {/* Open in Instagram Button */}
                    <a
                      href={user.url}
                      target="_blank"
                      rel="noreferrer"
                      title="Buka Profil di Instagram"
                      className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Quick Mark Unfollowed */}
                    {activeTab === 'notFollowingBack' && (
                      <button
                        onClick={() => markAsUnfollowed(user.username)}
                        title="Tandai Sudah Di-unfollow"
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-emerald-500/20 hover:text-emerald-400 text-zinc-400 text-xs font-medium transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {pageSize < filteredList.length && (
          <div className="p-4 border-t border-zinc-800 text-center">
            <button
              onClick={() => setPageSize((prev) => prev + 50)}
              className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
            >
              Muat 50 Akun Lagi ({filteredList.length - pageSize} tersisa)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

