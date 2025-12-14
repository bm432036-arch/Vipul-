import React, { useState } from 'react';
import { Trash2, Plus, Globe, AlertTriangle, Youtube, Instagram, Facebook, Twitter, Smartphone, Link, Lock, Target, ShieldBan, Database, HardDrive, FileCode, Server } from 'lucide-react';
import { BlockedItem } from '../types';

interface BlockedListProps {
  items: BlockedItem[];
  onAdd: (name: string, url: string) => void;
  onRemove: (id: string) => void;
  disabled: boolean;
}

const BlockedList: React.FC<BlockedListProps> = ({ items, onAdd, onRemove, disabled }) => {
  const [newItemUrl, setNewItemUrl] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemUrl.trim()) return;

    let name = newItemUrl;
    let url = newItemUrl;
    
    if (newItemUrl.includes('.') && !newItemUrl.includes(' ')) {
        try {
        const urlObj = new URL(newItemUrl.startsWith('http') ? newItemUrl : `https://${newItemUrl}`);
        name = urlObj.hostname.replace('www.', '').split('.')[0];
        name = name.toUpperCase();
        } catch (e) {
        name = newItemUrl.toUpperCase();
        }
    } else {
        name = newItemUrl.toUpperCase();
        url = `${newItemUrl.toLowerCase().replace(/\s/g, '')}.com`; 
    }

    onAdd(name, url);
    setNewItemUrl('');
  };

  // Helper to generate "Real" looking package names
  const getPackageName = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('face')) return 'com.facebook.katana'; // Real FB Package
    if (n.includes('insta')) return 'com.instagram.android';
    if (n.includes('you')) return 'com.google.android.youtube';
    if (n.includes('twit') || n.includes('x')) return 'com.twitter.android';
    if (n.includes('snap')) return 'com.snapchat.android';
    if (n.includes('tik')) return 'com.zhiliaoapp.musically';
    if (n.includes('whats')) return 'com.whatsapp';
    return `com.${n.replace(/[^a-z0-9]/g, '')}.global`;
  };

  const quickApps = [
    { name: 'INSTAGRAM', url: 'instagram.com', icon: <Instagram size={24} className="text-pink-500 group-hover:text-white transition-colors" /> },
    { name: 'YOUTUBE', url: 'youtube.com', icon: <Youtube size={24} className="text-red-500 group-hover:text-white transition-colors" /> },
    { name: 'FACEBOOK', url: 'facebook.com', icon: <Facebook size={24} className="text-blue-500 group-hover:text-white transition-colors" /> },
    { name: 'TWITTER (X)', url: 'twitter.com', icon: <Twitter size={24} className="text-sky-500 group-hover:text-white transition-colors" /> },
  ];

  const getIcon = (name: string, url: string) => {
    const lowerName = name.toLowerCase();
    const lowerUrl = url.toLowerCase();
    
    if (lowerName.includes('insta') || lowerUrl.includes('instagram')) return <Instagram size={18} className="text-pink-500" />;
    if (lowerName.includes('youtu') || lowerUrl.includes('youtu')) return <Youtube size={18} className="text-red-500" />;
    if (lowerName.includes('face') || lowerUrl.includes('facebook')) return <Facebook size={18} className="text-blue-500" />;
    if (lowerName.includes('twitter') || lowerUrl.includes('twitter') || lowerName.includes('x')) return <Twitter size={18} className="text-sky-500" />;
    
    return <Globe size={18} className="text-blue-400" />;
  };

  return (
    <div className="w-full bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden shadow-lg shadow-black/20">
      <div className="p-4 border-b border-slate-700 bg-slate-800/80 flex justify-between items-center">
        <h2 className="font-semibold text-slate-200 flex items-center gap-2 uppercase tracking-wider text-xs">
          <Globe size={14} className="text-emerald-400" />
          Global Blacklist Database
        </h2>
        <span className="text-[10px] bg-emerald-900/20 px-2 py-1 rounded text-emerald-300 border border-emerald-900/30 font-mono font-bold flex items-center gap-1">
          <Server size={10} />
          CONNECTED
        </span>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Quick Actions */}
        {!disabled && (
          <div className="space-y-3">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold flex items-center gap-2">
              <Smartphone size={12} />
              Global Block Presets (All Users)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickApps.map((app) => (
                <button
                  key={app.name}
                  onClick={() => onAdd(app.name, app.url)}
                  className="flex flex-col items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all py-3 px-2 rounded-lg text-sm text-slate-300 hover:text-white group shadow-sm"
                >
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 group-hover:border-slate-600 transition-colors duration-300">
                    {app.icon}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold font-mono text-[10px]">{app.name}</span>
                    <span className="text-[8px] text-slate-600 font-mono">{getPackageName(app.name)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="space-y-2">
           {!disabled && <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Enter Link to Block Globally</label>}
           <form onSubmit={handleAdd} className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemUrl}
                onChange={(e) => setNewItemUrl(e.target.value)}
                placeholder="LINK OR APP NAME (E.G. FACEBOOK)"
                disabled={disabled}
                className="flex-1 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all placeholder:text-slate-600 font-mono text-sm uppercase"
              />
              <button
                type="submit"
                disabled={disabled || !newItemUrl}
                className="bg-red-600 hover:bg-red-500 text-white border border-red-500 hover:border-red-400 px-6 py-2 rounded-lg font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              >
                <Globe size={16} />
                <span className="hidden sm:inline text-xs">INITIATE GLOBAL BAN</span>
              </button>
            </div>
            {disabled && (
               <div className="absolute -bottom-6 left-0 text-[10px] text-red-500 flex items-center gap-1 animate-pulse font-bold font-mono">
                  <AlertTriangle size={10} />
                  GLOBAL DATABASE LOCKED. CHANGES REJECTED.
               </div>
            )}
          </form>
        </div>

        {/* List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {items.length === 0 ? (
            <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-800 rounded-lg bg-slate-900/30">
              <p className="text-xs font-mono">GLOBAL DATABASE WAITING FOR INPUT...</p>
              <p className="text-[10px] mt-1 opacity-60">Enter a link to block it in all countries.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded-md group hover:border-red-900/50 transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                    {getIcon(item.name, item.url)}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-300 truncate text-xs font-mono tracking-tight uppercase">{item.name}</span>
                        <span className="bg-red-500/20 text-red-400 text-[8px] px-1 rounded border border-red-500/30 font-bold animate-pulse">WORLDWIDE BAN</span>
                    </div>
                    <span className="text-[9px] text-emerald-600 truncate font-mono uppercase tracking-wide flex items-center gap-1">
                       <Globe size={8} />
                       GLOBAL NETWORK • {getPackageName(item.name)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  disabled={disabled}
                  className={`p-2 rounded-md transition-colors ${
                    disabled 
                      ? 'text-slate-800 cursor-not-allowed opacity-0' 
                      : 'text-slate-600 hover:text-red-400 hover:bg-red-500/10 opacity-100'
                  }`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockedList;