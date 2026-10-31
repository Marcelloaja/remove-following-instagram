'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileArchive, FileCode, Sparkles, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { processZipFile, parseRawInstagramList, computeComparison } from '@/utils/instagramParser';
import { ParseResult, InstagramUser } from '@/types/instagram';

interface FileUploaderProps {
  onParsed: (result: ParseResult) => void;
  onOpenGuide: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onParsed, onOpenGuide }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');

  const [followersText, setFollowersText] = useState('');
  const [followingText, setFollowingText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setLoading(true);

    try {
      const fileList = Array.from(files);
      const zipFile = fileList.find((f) => f.name.toLowerCase().endsWith('.zip'));

      if (zipFile) {
        const result = await processZipFile(zipFile);
        if (result.followers.length === 0 && result.following.length === 0) {
          throw new Error('Tidak ditemukan data pengikut/mengikuti di dalam file ZIP. Pastikan Anda mengunduh bagian "Followers and Following" dalam format JSON.');
        }
        const comparison = computeComparison(result.followers, result.following);
        onParsed(comparison);
        return;
      }

      // Handle standalone JSON files
      let followersData: InstagramUser[] = [];
      let followingData: InstagramUser[] = [];

      for (const file of fileList) {
        const text = await file.text();
        const json = JSON.parse(text);
        const name = file.name.toLowerCase();

        const isFollowing =
          (json && typeof json === 'object' && !Array.isArray(json) && 'relationships_following' in json) ||
          (name.startsWith('following') && !name.includes('follower'));

        const isFollowers =
          name.startsWith('follower') || name.includes('followers');

        if (isFollowing) {
          followingData.push(...parseRawInstagramList(json));
        } else if (isFollowers) {
          followersData.push(...parseRawInstagramList(json));
        } else {
          // Fallback heuristic
          if (json && typeof json === 'object' && 'relationships_following' in json) {
            followingData.push(...parseRawInstagramList(json));
          } else {
            followersData.push(...parseRawInstagramList(json));
          }
        }
      }

      if (followersData.length === 0 && followingData.length === 0) {
        throw new Error('Format file tidak dikenali. Unggah file .zip resmi Meta atau file followers_1.json dan following.json.');
      }

      if (followersData.length === 0) {
        throw new Error('File followers_1.json belum diunggah! Harap pilih kedua file (followers_1.json DAN following.json) agar sistem bisa membandingkan.');
      }

      if (followingData.length === 0) {
        throw new Error('File following.json belum diunggah! Harap pilih kedua file (followers_1.json DAN following.json) agar sistem bisa membandingkan.');
      }

      const comparison = computeComparison(followersData, followingData);
      onParsed(comparison);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error)?.message || 'Terjadi kesalahan saat membaca file.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleManualParse = () => {
    setError(null);
    try {
      if (!followingText.trim()) {
        setError('Harap masukkan data akun yang Anda ikuti (Following).');
        return;
      }

      const parseField = (text: string) => {
        const trimmed = text.trim();
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          return parseRawInstagramList(JSON.parse(trimmed));
        }
        // Fallback: list of usernames line by line
        return trimmed
          .split(/[\n,]+/)
          .map((s) => s.trim().replace(/^@/, ''))
          .filter(Boolean)
          .map((username) => ({
            username: username.toLowerCase(),
            url: `https://www.instagram.com/${username.toLowerCase()}`,
          }));
      };

      const parsedFollowers = followersText ? parseField(followersText) : [];
      const parsedFollowing = parseField(followingText);

      const comparison = computeComparison(parsedFollowers, parsedFollowing);
      onParsed(comparison);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Format teks tidak valid. Masukkan JSON atau daftar username per baris.');
    }
  };

  const loadDemoData = () => {
    // Demo accounts for instant live testing
    const sampleFollowing = [
      { username: 'cristiano', url: 'https://www.instagram.com/cristiano', timestamp: 1714521600, followedAtFormatted: '1 Mei 2024' },
      { username: 'selenagomez', url: 'https://www.instagram.com/selenagomez', timestamp: 1712016000, followedAtFormatted: '2 Apr 2024' },
      { username: 'billieeilish', url: 'https://www.instagram.com/billieeilish', timestamp: 1709424000, followedAtFormatted: '3 Mar 2024' },
      { username: 'techcrunch', url: 'https://www.instagram.com/techcrunch', timestamp: 1704240000, followedAtFormatted: '3 Jan 2024' },
      { username: 'apple', url: 'https://www.instagram.com/apple', timestamp: 1701561600, followedAtFormatted: '3 Des 2023' },
      { username: 'budi_santoso99', url: 'https://www.instagram.com/budi_santoso99', timestamp: 1715000000, followedAtFormatted: '6 Mei 2024' },
      { username: 'sarah_amalia', url: 'https://www.instagram.com/sarah_amalia', timestamp: 1713000000, followedAtFormatted: '13 Apr 2024' },
      { username: 'dimas_pratama', url: 'https://www.instagram.com/dimas_pratama', timestamp: 1711000000, followedAtFormatted: '21 Mar 2024' },
      { username: 'travel_indonesia_id', url: 'https://www.instagram.com/travel_indonesia_id', timestamp: 1708000000, followedAtFormatted: '15 Feb 2024' },
      { username: 'kuliner_hits_jkt', url: 'https://www.instagram.com/kuliner_hits_jkt', timestamp: 1706000000, followedAtFormatted: '23 Jan 2024' },
      { username: 'sahabat_lama_12', url: 'https://www.instagram.com/sahabat_lama_12', timestamp: 1700000000, followedAtFormatted: '14 Nov 2023' },
      { username: 'teman_kuliah_andi', url: 'https://www.instagram.com/teman_kuliah_andi', timestamp: 1695000000, followedAtFormatted: '18 Sep 2023' },
    ];

    const sampleFollowers = [
      { username: 'sahabat_lama_12', url: 'https://www.instagram.com/sahabat_lama_12', timestamp: 1700000000, followedAtFormatted: '14 Nov 2023' },
      { username: 'teman_kuliah_andi', url: 'https://www.instagram.com/teman_kuliah_andi', timestamp: 1695000000, followedAtFormatted: '18 Sep 2023' },
      { username: 'reza_fan_club', url: 'https://www.instagram.com/reza_fan_club', timestamp: 1712000000, followedAtFormatted: '2 Apr 2024' },
      { username: 'olshop_terpercaya', url: 'https://www.instagram.com/olshop_terpercaya', timestamp: 1716000000, followedAtFormatted: '18 Mei 2024' },
    ];

    const comparison = computeComparison(sampleFollowers, sampleFollowing);
    onParsed(comparison);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-zinc-800 mb-6">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'upload'
              ? 'border-rose-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-300'
          }`}
        >
          <FileArchive className="w-4 h-4 text-rose-400" />
          <span>Upload File ZIP / JSON</span>
        </button>

        <button
          onClick={() => setActiveTab('paste')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'paste'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-300'
          }`}
        >
          <FileCode className="w-4 h-4 text-purple-400" />
          <span>Paste Data Manual</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Gagal memproses data</p>
            <p className="text-xs text-red-400 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {activeTab === 'upload' ? (
        <div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-rose-500 bg-rose-500/5 scale-[1.01]'
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".zip,.json,.html"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-zinc-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              {loading ? (
                <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-rose-400" />
              )}
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
              {loading ? 'Sedang mengekstrak & memproses data...' : 'Seret file .ZIP atau .JSON ke sini'}
            </h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto mb-5 leading-relaxed">
              Langsung drop file ZIP dari Instagram (Meta Data Export), atau pilih file <code className="text-rose-400 bg-zinc-950 px-1.5 py-0.5 rounded">followers_1.json</code> dan <code className="text-purple-400 bg-zinc-950 px-1.5 py-0.5 rounded">following.json</code>.
            </p>

            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Pilih File Dari Komputer / HP</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-xs text-zinc-400">
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-2 text-rose-400 hover:text-rose-300 font-medium transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Belum punya file export data Instagram? Lihat panduan 1 menit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={loadDemoData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Coba Demo Preview</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Data Following (Orang yang Anda Ikuti) <span className="text-rose-400">*Wajib</span>
              </label>
              <textarea
                value={followingText}
                onChange={(e) => setFollowingText(e.target.value)}
                rows={7}
                placeholder="Paste isi following.json atau daftar username per baris, contoh:&#10;@cristiano&#10;@selenagomez"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Data Followers (Pengikut Anda) <span className="text-zinc-500">(Opsional jika hanya ingin import)</span>
              </label>
              <textarea
                value={followersText}
                onChange={(e) => setFollowersText(e.target.value)}
                rows={7}
                placeholder="Paste isi followers_1.json atau daftar username per baris, contoh:&#10;@sahabat_lama&#10;@teman_kuliah"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={loadDemoData}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Gunakan Data Contoh Demo</span>
            </button>

            <button
              onClick={handleManualParse}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2"
            >
              <span>Bandingkan & Tampilkan Data</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

