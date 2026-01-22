
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Cpu, HardDrive, X, Globe, Terminal, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';

const DeploymentHUD: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Check if API key is configured (basic check for presence)
  const isApiKeyConfigured = !!process.env.API_KEY;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="fixed top-6 right-6 z-[100] hidden lg:flex flex-col gap-3">
        <motion.div 
          onClick={() => setIsOpen(true)}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hud-clickable cursor-pointer glass-card px-4 py-3 rounded-2xl flex items-center gap-3 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:bg-zinc-900/40 transition-colors pointer-events-auto"
        >
          <div className="relative">
            <Activity className="w-4 h-4 text-blue-500" />
            <motion.div 
              animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-blue-500 rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Network Status</span>
            <span className="text-[10px] text-zinc-200 font-bold">STATION_LIVE_PRIME</span>
          </div>
        </motion.div>

        {!isApiKeyConfigured && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-2xl flex items-center gap-3 animate-pulse"
          >
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">API_KEY Missing</span>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl glass-card rounded-[3rem] overflow-hidden border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.1)]"
            >
              <div className="bg-zinc-900/50 p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                   <Terminal className="text-blue-500 w-5 h-5" />
                   <h3 className="text-white text-xs font-black uppercase tracking-widest">Global Launch Terminal</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-2">Environment Vitals</span>
                      <div className="flex flex-col gap-2 font-mono text-sm">
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-zinc-500">Node Status:</span>
                          <span className="text-emerald-500">ONLINE</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-zinc-500">API Config:</span>
                          <span className={isApiKeyConfigured ? "text-emerald-500" : "text-red-500"}>
                            {isApiKeyConfigured ? "VALIDATED" : "NOT_FOUND"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Latency:</span>
                          <span className="text-blue-500">OPTIMAL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block">Readiness Score</span>
                    <div className="relative h-24 flex items-center justify-center">
                       <svg className="w-20 h-20 -rotate-90">
                         <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-800" />
                         <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="220" strokeDashoffset={isApiKeyConfigured ? "22" : "150"} className="text-blue-500 transition-all duration-1000" />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center text-white font-black text-xl">
                         {isApiKeyConfigured ? "95%" : "30%"}
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 bg-white/5 p-8 rounded-[2rem] border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="text-yellow-500 w-5 h-5" />
                    <span className="text-white text-xs font-black uppercase tracking-widest">Free Deployment Guide</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-white font-bold shrink-0">1</div>
                      <p className="text-zinc-400 text-xs">Push this code to a <strong>GitHub</strong> repository.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-white font-bold shrink-0">2</div>
                      <p className="text-zinc-400 text-xs">Login to <strong>Vercel.com</strong> and import that repository.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-white font-bold shrink-0">3</div>
                      <p className="text-zinc-400 text-xs">In Vercel Settings, add <code>API_KEY</code> as an Environment Variable.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                   {!isApiKeyConfigured ? (
                     <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Configure API_KEY to proceed</span>
                     </div>
                   ) : (
                     <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">System ready for launch</span>
                     </div>
                   )}
                   <button 
                    onClick={() => setIsOpen(false)}
                    className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
                   >
                     Acknowledge
                   </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeploymentHUD;
