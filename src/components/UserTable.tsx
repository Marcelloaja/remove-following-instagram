'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  UserX,
  Users,
  HeartHandshake,
  Shield,
  Star,
  ExternalLink,
  Check,
  CheckSquare,
  Square,
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

  return (
    <div className="space-y-6">
      {/* Metric Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => {
            setActiveTab('notFollowingBack');
            setSelectedUsernames([]);
          }}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'notFollowingBack'
              ? 'bg-white border-slate-900 shadow-xs ring-1 ring-slate-900'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-600">Tidak Follback Kamu</span>
            <UserX className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {data.notFollowingBack.length - unfollowedLocally.size}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Anda follow, mereka tidak</p>
        </button>

        <button
          onClick={() => {
            setActiveTab('fans');
            setSelectedUsernames([]);
          }}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'fans'
              ? 'bg-white border-slate-900 shadow-xs ring-1 ring-slate-900'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-600">Fans (Followers Saja)</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{data.fans.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Mereka follow, Anda belum</p>
        </button>

        <button
          onClick={() => {
            setActiveTab('mutuals');
            setSelectedUsernames([]);
          }}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'mutuals'
              ? 'bg-white border-slate-900 shadow-xs ring-1 ring-slate-900'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-600">Saling Follow (Mutuals)</span>
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{data.mutuals.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Saling mengikuti</p>
        </button>

        <button
          onClick={() => {
            setActiveTab('whitelist');
            setSelectedUsernames([]);
          }}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'whitelist'
              ? 'bg-white border-slate-900 shadow-xs ring-1 ring-slate-900'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-600">Dilindungi (Whitelist)</span>
            <Shield className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{whitelist.size}</div>
          <p className="text-[11px] text-slate-500 mt-1">Akun yang dikecualikan</p>
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama akun (@username)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Sort & Export */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              <option value="date-desc">Tanggal Follow (Terbaru)</option>
              <option value="date-asc">Tanggal Follow (Terlama)</option>
              <option value="alpha-asc">Abjad (A - Z)</option>
              <option value="alpha-desc">Abjad (Z - A)</option>
            </select>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Batch selection toolbar for Not Following Back */}
        {activeTab === 'notFollowingBack' && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hideWhitelisted}
                onChange={(e) => setHideWhitelisted(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-0"
              />
              <span className="text-xs">Sembunyikan akun yang dilindungi (whitelist)</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 mr-1">Pilih Cepat:</span>
              <button
                onClick={() => handleSelectQuick(10)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                10
              </button>
              <button
                onClick={() => handleSelectQuick(25)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                25
              </button>
              <button
                onClick={() => handleSelectQuick(50)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                50
              </button>
              <button
                onClick={handleSelectAllVisible}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                Semua Halaman Ini ({Math.min(filteredList.length, pageSize)})
              </button>
              {selectedUsernames.length > 0 && (
                <button
                  onClick={handleClearSelection}
                  className="px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <div>
            Menampilkan <strong className="text-slate-800">{visibleList.length}</strong> dari{' '}
            <strong className="text-slate-800">{filteredList.length}</strong> akun
          </div>
          {selectedUsernames.length > 0 && (
            <div className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {selectedUsernames.length} akun dipilih
            </div>
          )}
        </div>

        {filteredList.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Tidak ada akun yang sesuai dengan filter pencarian.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {visibleList.map((user) => {
              const isSelected = selectedUsernames.includes(user.username);
              const isWhitelisted = whitelist.has(user.username);

              return (
                <div
                  key={user.username}
                  className={`flex items-center justify-between px-4 py-3 transition-colors ${
                    isSelected ? 'bg-slate-50' : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Left: Checkbox, Avatar, Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    {activeTab === 'notFollowingBack' && (
                      <button
                        onClick={() => handleToggleSelect(user.username)}
                        disabled={isWhitelisted}
                        className={`text-slate-400 hover:text-slate-700 transition-colors cursor-pointer ${
                          isWhitelisted ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-slate-900" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    )}

                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs shrink-0">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={user.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-xs sm:text-sm text-slate-900 hover:underline truncate"
                        >
                          @{user.username}
                        </a>

                        {isWhitelisted && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            <span>Dilindungi</span>
                          </span>
                        )}
                      </div>

                      {user.followedAtFormatted && (
                        <p className="text-[11px] text-slate-400">
                          Di-follow sejak: {user.followedAtFormatted}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleWhitelist(user.username)}
                      title={isWhitelisted ? 'Hapus dari proteksi' : 'Lindungi akun agar tidak di-unfollow'}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                        isWhitelisted
                          ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isWhitelisted ? 'fill-amber-500' : ''}`} />
                    </button>

                    <a
                      href={user.url}
                      target="_blank"
                      rel="noreferrer"
                      title="Buka profil di tab baru"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {activeTab === 'notFollowingBack' && (
                      <button
                        onClick={() => markAsUnfollowed(user.username)}
                        title="Tandai sudah selesai di-unfollow"
                        className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
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

        {pageSize < filteredList.length && (
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
            <button
              onClick={() => setPageSize((prev) => prev + 50)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Tampilkan 50 Akun Lagi ({filteredList.length - pageSize} tersisa)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
