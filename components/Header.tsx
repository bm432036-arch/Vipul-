import React from 'react';
import { ShieldCheck, Lock, Globe, Server, Users, User, Smartphone } from 'lucide-react';

interface HeaderProps {
  isLocked: boolean;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ isLocked, userName }) => {
  return (
    <header className="w-full p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isLocked ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {isLocked ? <Globe size={24} /> : <ShieldCheck size={24} />}
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight uppercase">FocusVault <span className="text-slate-500 text-xs ml-1">GLOBAL SYSTEM</span></h1>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">
                {isLocked ? 'WORLDWIDE SERVER LINKED' : 'SERVER ONLINE'}
                </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
            {userName && (
                <div className="flex items-center gap-2 mb-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                    <User size={10} className="text-slate-400"/>
                    <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">{userName}</span>
                </div>
            )}
            <div className="flex items-center gap-1 text-slate-500 text-[10px] font-mono uppercase tracking-wider mb-1">
                <Smartphone size={10} />
                <span>Devices Secured Globally</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 px-2 py-1 rounded flex items-center gap-2">
                 <Globe size={12} className={isLocked ? "text-red-400" : "text-blue-400"} />
                 <span className="text-xs font-bold text-slate-300 tabular-nums">2,409,128</span>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;