'use client';

import React, { useState, useRef } from 'react';
import { Upload, FolderArchive, FileText, ArrowRight, AlertCircle, HelpCircle, PlayCircle } from 'lucide-react';
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
          throw new Error('Tidak ditemukan data followers/following di dalam file ZIP. Pastikan Anda mengunduh bagian "Followers and Following" dalam format JSON dari Meta.');
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
        throw new Error('File followers_1.json belum diunggah! Harap pilih kedua file (followers_1.json dan following.json).');
      }

      if (followingData.length === 0) {
        throw new Error('File following.json belum diunggah! Harap pilih kedua file (followers_1.json dan following.json).');
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
    <div className="w-full max-w-2xl mx-auto">
      {/* Tab Selector */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl mb-4 w-fit mx-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Upload File ZIP / JSON
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'paste'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Input Manual (Daftar Akun)
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <div className="flex-1">
            <span className="font-semibold">Perhatian:</span> {error}
          </div>
        </div>
      )}

      {activeTab === 'upload' ? (
        <div className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-slate-800 bg-slate-50'
                : 'border-slate-300 hover:border-slate-400 bg-white'
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

            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center mx-auto mb-3">
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FolderArchive className="w-6 h-6 text-slate-700" />
              )}
            </div>

            <h3 className="text-base font-semibold text-slate-900 mb-1">
              {loading ? 'Mengekstrak dan memproses file...' : 'Tarik & lepas file data Instagram ke sini'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
              Mendukung file <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">.zip</span> unduhan resmi Meta, atau file <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">followers_1.json</span> & <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">following.json</span>.
            </p>

            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-medium transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Pilih File Dari Komputer / HP</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 text-xs text-slate-600">
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 hover:underline cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Belum tahu cara download data dari Meta? Buka panduan</span>
            </button>

            <button
              onClick={loadDemoData}
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <PlayCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Coba Demo Data</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Data Following (Yang Anda Ikuti) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={followingText}
                onChange={(e) => setFollowingText(e.target.value)}
                rows={6}
                placeholder="Daftar username atau isi file following.json, misal:&#10;@cristiano&#10;@techcrunch"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Data Followers (Pengikut Anda)
              </label>
              <textarea
                value={followersText}
                onChange={(e) => setFollowersText(e.target.value)}
                rows={6}
                placeholder="Daftar username pengikut atau isi followers_1.json, misal:&#10;@teman_lama&#10;@sahabat"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={loadDemoData}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Gunakan data contoh demo</span>
            </button>

            <button
              onClick={handleManualParse}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Bandingkan Akun</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
