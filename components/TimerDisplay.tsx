import React, { useEffect, useState, useRef } from 'react';
import { Clock, BrainCircuit, Lock, Youtube, Instagram, Facebook, Twitter, Link, Terminal, Activity, ShieldAlert, WifiOff, Globe, Server, UserCheck, UserX, Fingerprint, Smartphone, Cpu } from 'lucide-react';
import { BlockedItem } from '../types';

interface TimerDisplayProps {
  endTime: number | null;
  durationMinutes: number;
  onComplete: () => void;
  motivationMessage: string;
  blockedItems: BlockedItem[];
  userName: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ endTime, durationMinutes, onComplete, motivationMessage, blockedItems, userName }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progress, setProgress] = useState<number>(100);
  const [logs, setLogs] = useState<string[]>([]);
  const [blockedRequests, setBlockedRequests] = useState(0);

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setProgress(0);
        onComplete();
      } else {
        setTimeLeft(diff);
        const totalMs = durationMinutes * 60 * 1000;
        const percent = (diff / totalMs) * 100;
        setProgress(percent);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, durationMinutes, onComplete]);

  const getPackageName = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('face')) return 'com.facebook.katana';
    if (n.includes('insta')) return 'com.instagram.android';
    if (n.includes('you')) return 'com.google.android.youtube';
    if (n.includes('twit') || n.includes('x')) return 'com.twitter.android';
    if (n.includes('snap')) return 'com.snapchat.android';
    if (n.includes('tik')) return 'com.zhiliaoapp.musically';
    return `com.${n.replace(/[^a-z0-9]/g, '')}.global`;
  };

  // Fake Security Logs and Request Counter
  useEffect(() => {
    const addLog = () => {
       const actions = [
         "SERVER_DENY:",
         "PACKET_DROP:",
         "GLOBAL_FW_BLOCK:",
         "ISP_FILTER:",
         "DNS_SINKHOLE:"
       ];
       
       const regions = [
         "[US-EAST]", "[IN-MUM]", "[IN-DEL]", "[EU-LON]", "[EU-FRA]", "[ASIA-SG]", "[SA-BR]"
       ];
       
       if (blockedItems.length > 0) {
         const randomItem = blockedItems[Math.floor(Math.random() * blockedItems.length)];
         const pkg = getPackageName(randomItem.name);
         const randomAction = actions[Math.floor(Math.random() * actions.length)];
         const region = regions[Math.floor(Math.random() * regions.length)];
         const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
         const newLog = `[${time}] ${region} ${randomAction} ${pkg}`;
         
         setLogs(prev => [...prev.slice(-5), newLog]);
         
         // Random increment for effect
         setBlockedRequests(prev => prev + Math.floor(Math.random() * 3) + 1);
       }
    };

    // Initial
    addLog();

    const interval = setInterval(addLog, 1400); // Faster logs for "Real" feel
    return () => clearInterval(interval);
  }, [blockedItems]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Circular Progress Math
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-6">
      <div className="relative w-[300px] h-[300px] flex items-center justify-center">
        {/* Background Circle */}
        <svg className="transform -rotate-90 w-full h-full drop-shadow-2xl">
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-800"
          />
          {/* Progress Circle */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-red-600 transition-all duration-1000 ease-linear shadow-[0_0_20px_rgba(220,38,38,0.6)]"
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="bg-red-500/10 p-3 rounded-full mb-2 animate-pulse border border-red-500/20">
             <Globe className="text-red-500" size={32} />
          </div>
          <div className="text-5xl font-bold tabular-nums tracking-tighter text-white drop-shadow-md font-mono">
            {formatTime(timeLeft)}
          </div>
          <p className="text-red-400 mt-2 text-[10px] uppercase tracking-widest font-bold animate-pulse flex items-center gap-1">
            <Server size={10} />
            Global Ban Active
          </p>
        </div>
      </div>

      {/* Target User Identity Card */}
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-center justify-between shadow-lg relative overflow-hidden group">
         {/* Scanning effect line */}
         <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-500/50 animate-pulse"></div>
         
         <div className="flex items-center gap-4 z-10">
            <div className="bg-slate-900 p-3 rounded border border-slate-700 text-emerald-500">
                <Cpu size={24} />
            </div>
            <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Primary Target ID</div>
                <div className="text-lg font-black text-white font-mono uppercase tracking-tight flex items-center gap-2">
                    {userName}
                </div>
                <div className="text-[9px] text-emerald-500 font-mono mt-0.5">DEVICE STATUS: LOCKED</div>
            </div>
         </div>
         <div className="z-10 flex flex-col items-end">
             <span className="text-[9px] font-bold bg-red-900/50 text-red-200 px-2 py-1 rounded border border-red-800 animate-pulse">
                 BLOCKED IN ALL REGIONS
             </span>
         </div>
      </div>

      {/* Active Traffic Interception Counter */}
      <div className="w-full max-w-md bg-slate-900/80 border border-red-500/30 rounded-lg p-4 flex items-center justify-between shadow-[0_0_15px_rgba(220,38,38,0.1)]">
         <div className="flex items-center gap-3">
             <Globe className="text-red-500 animate-pulse" size={20} />
             <div>
                 <h4 className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Global Requests Intercepted</h4>
                 <div className="text-2xl font-mono font-bold text-white tabular-nums">{blockedRequests.toLocaleString()}</div>
             </div>
         </div>
         <div className="text-right">
             <div className="text-[9px] text-slate-500 font-mono uppercase">Server Load</div>
             <div className="text-blue-400 font-bold font-mono text-xs flex items-center gap-1 justify-end">
                99.8% OPTIMAL
             </div>
         </div>
      </div>
      
      {/* Active Security Log */}
      <div className="w-full max-w-md bg-black rounded-lg border border-slate-800 overflow-hidden font-mono text-xs shadow-inner">
        <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex justify-between items-center">
          <span className="text-slate-400 flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
            <Terminal size={10} />
            Live Server Log (All Countries)
          </span>
          <span className="flex items-center gap-1 text-emerald-500 animate-pulse font-bold text-[10px]">
             <WifiOff size={10} />
             BROADCASTING
          </span>
        </div>
        <div className="p-3 space-y-1 h-[100px] flex flex-col justify-end text-slate-300 bg-black">
           {logs.map((log, idx) => (
             <div key={idx} className="truncate text-emerald-500/80 font-mono text-[10px]">
                <span className="text-slate-600 mr-2">{'>'}</span>
                {log}
             </div>
           ))}
        </div>
      </div>

      {/* GLOBAL ENFORCEMENT MANIFEST */}
      <div className="w-full max-w-md space-y-3">
         <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold px-1 tracking-widest border-b border-slate-800 pb-1">
            <span>Active Global Bans</span>
            <span className="flex items-center gap-1 text-blue-400"><Globe size={10}/> SYNCED WORLDWIDE</span>
         </div>
         
         <div className="bg-slate-950 border border-slate-900 rounded-lg p-2 space-y-1">
            {blockedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 rounded hover:bg-slate-900 group cursor-default border-b border-slate-900 last:border-0">
                  <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${Math.random() > 0.5 ? 'bg-red-500 animate-pulse' : 'bg-red-600'}`}></div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-300 font-mono uppercase group-hover:text-white">
                            {item.name}
                        </span>
                        <span className="text-[9px] text-slate-600 font-mono">
                            {getPackageName(item.name)}
                        </span>
                      </div>
                  </div>
                  
                  <div className="flex items-center">
                      <span className="text-[9px] text-slate-400 font-mono font-bold uppercase bg-slate-900 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Globe size={8} />
                          REGION: ALL
                      </span>
                  </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default TimerDisplay;