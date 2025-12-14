import React, { useState, useEffect, useCallback } from 'react';
import { Play, Square, AlertOctagon, Clock, ShieldAlert, ShieldCheck, Loader2, Globe, User, Fingerprint, Smartphone } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import Header from './components/Header';
import BlockedList from './components/BlockedList';
import TimerDisplay from './components/TimerDisplay';
import { BlockedItem, SessionStatus, SessionConfig } from './types';
import { getFocusMotivation, getUnlockDeterrent } from './services/geminiService';

const App: React.FC = () => {
  // State
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.IDLE);
  const [blockedItems, setBlockedItems] = useState<BlockedItem[]>([]);
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    durationMinutes: 240, // 4 Hours Default for Deep Work
    startTime: null,
    endTime: null
  });
  const [motivation, setMotivation] = useState<string>("Initialize session to activate shielding.");
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);
  const [aiDeterrent, setAiDeterrent] = useState("");
  const [isLocking, setIsLocking] = useState(false);
  const [lockingStep, setLockingStep] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  // Load from LocalStorage on Mount
  useEffect(() => {
    const savedItems = localStorage.getItem('focusvault_items');
    const savedConfig = localStorage.getItem('focusvault_config');
    const savedStatus = localStorage.getItem('focusvault_status');
    const savedUser = localStorage.getItem('focusvault_username');

    if (savedItems) setBlockedItems(JSON.parse(savedItems));
    if (savedUser) setUserName(savedUser);
    
    if (savedStatus === SessionStatus.RUNNING && savedConfig) {
      const config = JSON.parse(savedConfig);
      // Check if expired while away
      if (config.endTime && Date.now() > config.endTime) {
        setStatus(SessionStatus.COMPLETED);
        localStorage.removeItem('focusvault_config');
        localStorage.setItem('focusvault_status', SessionStatus.COMPLETED);
      } else {
        setSessionConfig(config);
        setStatus(SessionStatus.RUNNING);
      }
    }
  }, []);

  // Save Items when changed
  useEffect(() => {
    localStorage.setItem('focusvault_items', JSON.stringify(blockedItems));
  }, [blockedItems]);

  // Strict Mode: Monitor Tab Switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (status === SessionStatus.RUNNING) {
        if (document.hidden) {
          document.title = "⚠️ GLOBAL BAN ACTIVE: DO NOT PROCEED";
        } else {
          document.title = "FocusVault - World Server Connected";
        }
      } else {
        document.title = "FocusVault - Global App Blocker";
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = "FocusVault - Global App Blocker";
    };
  }, [status]);

  // AI Motivation Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === SessionStatus.RUNNING) {
      // Initial fetch
      const fetchMotive = async () => {
        const timeLeft = sessionConfig.endTime 
          ? Math.floor((sessionConfig.endTime - Date.now()) / 60000) 
          : 0;
        const msg = await getFocusMotivation(timeLeft, blockedItems.length);
        setMotivation(msg);
      };
      
      fetchMotive();
      // Fetch new motivation every 15 minutes
      interval = setInterval(fetchMotive, 15 * 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [status, sessionConfig.endTime, blockedItems.length]);


  const handleAddItem = (name: string, url: string) => {
    // Check duplicates
    const exists = blockedItems.some(item => item.url.includes(url) || url.includes(item.url) || item.name === name);
    if(exists && !confirm(`Global database already contains ${name}. Update ban priority?`)) return;

    const newItem: BlockedItem = {
      id: uuidv4(),
      name, 
      url,
      dateAdded: Date.now()
    };
    setBlockedItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setBlockedItems(prev => prev.filter(i => i.id !== id));
  };

  const startSession = () => {
    if (blockedItems.length === 0) {
      alert("Please enter a link to initiate global blocking.");
      return;
    }

    const finalUserName = userName.trim() || `ADMIN-${Math.floor(1000 + Math.random() * 9000)}`;
    setUserName(finalUserName);
    localStorage.setItem('focusvault_username', finalUserName);

    setIsLocking(true);
    
    // "Real" Locking Sequence: Simulating Global Propagation
    const steps = [
        { msg: `AUTHENTICATING ADMIN CREDENTIALS...`, time: 800 },
        { msg: `CONNECTING TO WORLD SATELLITE SERVER...`, time: 1000 },
        { msg: `UPLOADING BLACKLIST TO CLOUD DATABASE...`, time: 1200 },
        { msg: `PROPAGATING BAN TO ASIA SERVERS (IN/JP/CN)...`, time: 800 },
        { msg: `PROPAGATING BAN TO AMERICA SERVERS (US/BR/CA)...`, time: 800 },
        { msg: `PROPAGATING BAN TO EUROPE SERVERS (UK/DE/FR)...`, time: 800 },
        { msg: `UPDATING GLOBAL ISP FIREWALLS...`, time: 1500 },
        { msg: `SENDING "KILL SIGNAL" TO ALL CONNECTED DEVICES...`, time: 1000 },
        ...blockedItems.slice(0, 2).map(item => ({ msg: `REVOKING CERTIFICATES FOR: ${item.name}...`, time: 600 })),
        { msg: `VERIFYING BLOCK ON ${finalUserName}'s DEVICE...`, time: 800 },
        { msg: `SUCCESS: WORLDWIDE RESTRICTION APPLIED.`, time: 1000 }
    ];

    let stepIndex = 0;
    
    const processStep = () => {
        if (stepIndex >= steps.length) {
            // Complete
            const now = Date.now();
            const endTime = now + (sessionConfig.durationMinutes * 60 * 1000);
            
            const newConfig = { ...sessionConfig, startTime: now, endTime };
            
            setSessionConfig(newConfig);
            setStatus(SessionStatus.RUNNING);
            
            localStorage.setItem('focusvault_config', JSON.stringify(newConfig));
            localStorage.setItem('focusvault_status', SessionStatus.RUNNING);
            setIsLocking(false);
            setMotivation(`Global Ban Active. Apps blocked on all user devices.`);
            return;
        }

        setLockingStep(steps[stepIndex].msg);
        setTimeout(() => {
            stepIndex++;
            processStep();
        }, steps[stepIndex].time);
    };

    processStep();
  };

  const handleComplete = useCallback(() => {
    setStatus(SessionStatus.COMPLETED);
    localStorage.setItem('focusvault_status', SessionStatus.COMPLETED);
    localStorage.removeItem('focusvault_config');
    setMotivation("Session Complete. Global Restrictions Lifted.");
  }, []);

  const handleGiveUpRequest = async () => {
    const deter = await getUnlockDeterrent("Global Firewall");
    setAiDeterrent(deter);
    setShowGiveUpModal(true);
  };

  const confirmGiveUp = () => {
    setStatus(SessionStatus.IDLE);
    localStorage.setItem('focusvault_status', SessionStatus.IDLE);
    localStorage.removeItem('focusvault_config');
    setShowGiveUpModal(false);
    setMotivation("Session Aborted. Firewall Reset.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-200 selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Locking Overlay */}
      {isLocking && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center text-center p-4 animate-in fade-in duration-500 cursor-wait">
           <div className="relative mb-8">
              <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse"></div>
              <Globe size={80} className="text-red-500 relative z-10 animate-[spin_3s_linear_infinite]" />
           </div>
           <h2 className="text-3xl font-bold text-white mb-3 tracking-tight uppercase font-mono">Global Sync</h2>
           <div className="space-y-2 text-slate-400 font-mono text-sm">
             <p className="text-red-400 animate-pulse text-lg font-bold uppercase tracking-wider">{lockingStep}</p>
           </div>
           <div className="w-64 h-1 bg-slate-900 mt-8 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-red-500 animate-[pulse_0.5s_ease-in-out_infinite] w-full origin-left scale-x-0 transition-transform duration-[500ms]" style={{ transform: 'scaleX(1)' }}></div>
           </div>
        </div>
      )}

      <Header isLocked={status === SessionStatus.RUNNING} userName={status === SessionStatus.RUNNING ? userName : undefined} />

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 flex flex-col gap-8">
        
        {/* Active Session View */}
        {status === SessionStatus.RUNNING && (
          <div className="animate-in fade-in zoom-in duration-500">
             <TimerDisplay 
                endTime={sessionConfig.endTime} 
                durationMinutes={sessionConfig.durationMinutes}
                onComplete={handleComplete}
                motivationMessage={motivation}
                blockedItems={blockedItems}
                userName={userName}
             />
             <div className="mt-8 text-center bg-red-500/5 border border-red-500/10 rounded-lg p-4 shadow-inner">
                <p className="text-red-400 text-xs font-mono mb-2 flex items-center justify-center gap-2 uppercase font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  WORLDWIDE SERVER ACTIVE: {blockedItems.length} GLOBAL BANS ENFORCED
                </p>
                <button 
                  onClick={handleGiveUpRequest}
                  className="text-slate-600 text-[10px] hover:text-red-400 transition-colors mt-2 underline decoration-slate-700 underline-offset-2"
                >
                  Request Emergency Admin Override
                </button>
             </div>
          </div>
        )}

        {/* Setup View / Idle */}
        {status !== SessionStatus.RUNNING && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            
            {/* Target Identity Input */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center gap-4 shadow-lg">
                <div className="bg-slate-800 p-3 rounded-full text-slate-400 shadow-inner">
                    <User size={24} />
                </div>
                <div className="flex-1">
                    <label className="block text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                        Identify Target (Device Owner) <span className="text-slate-600"></span>
                    </label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="bg-transparent border-none text-xl font-bold text-white focus:outline-none w-full placeholder:text-slate-600 uppercase font-mono tracking-tight"
                        placeholder="ENTER YOUR NAME..."
                    />
                </div>
            </div>

            {/* Duration Selector */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-emerald-400" />
                <h2 className="text-xl font-bold text-white uppercase tracking-wide">Ban Duration</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[60, 120, 240, 480].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setSessionConfig(prev => ({ ...prev, durationMinutes: mins }))}
                    className={`py-4 px-2 rounded-lg border font-medium transition-all relative overflow-hidden ${
                      sessionConfig.durationMinutes === mins
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    {sessionConfig.durationMinutes === mins && (
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                    )}
                    <span className="relative text-2xl font-bold block">{mins / 60}h</span>
                    <span className="relative text-xs opacity-80 uppercase font-bold">
                       {mins === 240 ? 'Deep Block' : mins === 60 ? 'Short Ban' : mins === 120 ? 'Medium' : 'Full Lock'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Block List */}
            <BlockedList 
              items={blockedItems} 
              onAdd={handleAddItem} 
              onRemove={handleRemoveItem}
              disabled={status === SessionStatus.RUNNING}
            />

            {/* Start Button */}
            <button
              onClick={startSession}
              className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-lg py-6 rounded-xl shadow-xl shadow-red-900/30 transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 border border-red-500/20 group"
            >
              <div className="bg-white/20 p-1 rounded-full group-hover:animate-pulse">
                 <Globe fill="currentColor" className="text-white" size={24} />
              </div>
              <div className="flex flex-col items-start leading-none">
                 <span className="uppercase tracking-wider text-sm">INITIATE GLOBAL BAN</span>
                 <span className="font-mono text-[10px] opacity-80">BLOCK APPS ON ALL DEVICES & COUNTRIES</span>
              </div>
            </button>

            {status === SessionStatus.COMPLETED && (
               <div className="p-6 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-center flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-4">
                 <ShieldCheck size={32} className="text-emerald-500 mb-2" />
                 <h3 className="text-emerald-400 font-bold text-lg uppercase">Ban Lifted</h3>
                 <p className="text-emerald-500/70 text-sm">Global restrictions have been removed.</p>
                 <button 
                    onClick={() => setStatus(SessionStatus.IDLE)}
                    className="mt-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-6 py-2 rounded-lg transition-colors border border-emerald-500/20"
                 >
                   Acknowledge
                 </button>
               </div>
            )}
          </div>
        )}
      </main>

      {/* Modal for Emergency Stop */}
      {showGiveUpModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-red-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Warning Strip */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
            
            <div className="flex items-center gap-4 text-red-500 mb-6">
              <div className="p-3 bg-red-500/10 rounded-full animate-pulse">
                 <AlertOctagon size={32} />
              </div>
              <div>
                 <h3 className="text-xl font-bold text-white">Global Security Alert</h3>
                 <p className="text-xs text-red-400 uppercase tracking-widest">Unauthorized Override Attempt</p>
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border-l-4 border-amber-500">
               <p className="text-lg text-slate-200 font-medium italic">
                 "{aiDeterrent}"
               </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowGiveUpModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold border border-slate-600 hover:border-slate-500 transition-all flex items-center justify-center gap-2 shadow-lg uppercase tracking-wide"
              >
                <ShieldCheck size={20} />
                MAINTAIN GLOBAL LOCK
              </button>
              <button
                onClick={confirmGiveUp}
                className="w-full bg-transparent hover:bg-red-950/30 text-red-500/70 hover:text-red-400 py-3 rounded-xl font-semibold text-sm transition-all"
              >
                Revoke Global Certificates (Force Stop)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;