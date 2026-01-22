
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, History, Utensils, Globe2, Loader2, Sparkles, AlertCircle, ChefHat, Globe, ArrowDown } from 'lucide-react';
import { AppStatus, FoodData } from './types';
import { fetchFoodHistory } from './services/geminiService';
import WorldMap from './components/WorldMap';
import EvolutionTimeline from './components/EvolutionTimeline';
import StatsSection from './components/StatsSection';
import CulturalInsights from './components/CulturalInsights';
import RegionalVariations from './components/RegionalVariations';
import DeploymentHUD from './components/DeploymentHUD';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [data, setData] = useState<FoodData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);

    try {
      const result = await fetchFoodHistory(query);
      setData(result);
      setStatus(AppStatus.SUCCESS);
      // Smooth scroll to results
      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
      }, 500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to uncover the culinary past. Please try again.');
      setStatus(AppStatus.ERROR);
    }
  }, [query]);

  // Fix: Added 'as const' to ensure transition properties like 'staggerChildren' are correctly typed for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  } as const;

  // Fix: Added 'as const' to resolve the 'ease' string vs Easing literal type mismatch in Framer Motion Variants
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  } as const;

  return (
    <div className="min-h-screen bg-[#020203] selection:bg-blue-500/30 overflow-x-hidden">
      {/* HUD System Display */}
      <DeploymentHUD />

      {/* Modern Background Layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full"></div>
      </div>

      <header className={`relative z-10 transition-all duration-1000 ease-in-out flex flex-col items-center justify-center p-6 ${status === AppStatus.IDLE ? 'h-screen' : 'pt-20 pb-12'}`}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 backdrop-blur-md">
            <Utensils className="text-blue-500 w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-white to-zinc-600 bg-clip-text text-transparent">
            CulinaryChronicle
          </h1>
        </motion.div>
        
        <div className={`text-center max-w-4xl transition-all duration-1000 ${status === AppStatus.IDLE ? 'scale-100 opacity-100' : 'scale-90 opacity-0 h-0 overflow-hidden mb-0'}`}>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight tracking-tight"
          >
            The <span className="italic bg-gradient-to-b from-zinc-200 to-zinc-500 bg-clip-text text-transparent">Lineage</span> of Flavor.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Every dish is a map of human migration. Reveal its millennia-long odyssey across empires and oceans with modern AI intelligence.
          </motion.p>
        </div>

        <motion.form 
          layout
          onSubmit={handleSearch} 
          className="relative w-full max-w-2xl group z-20"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-50"></div>
          <div className="relative flex items-center bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/50 rounded-2xl overflow-hidden focus-within:border-zinc-700 transition-all shadow-2xl">
            <Search className="ml-6 text-zinc-600 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a dish (e.g. Pad Thai, Risotto, Tacos...)"
              className="w-full bg-transparent text-white px-4 py-6 outline-none text-lg placeholder:text-zinc-700 font-medium"
            />
            <button 
              type="submit"
              disabled={status === AppStatus.LOADING}
              className="mr-3 px-8 py-3 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl transition-all flex items-center gap-2 font-black uppercase tracking-widest text-xs shadow-lg active:scale-95"
            >
              {status === AppStatus.LOADING ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Discover</span>
            </button>
          </div>
        </motion.form>

        {status === AppStatus.IDLE && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <div className="flex flex-wrap justify-center gap-3">
              {['Sourdough', 'Butter Chicken', 'Paella', 'Dumplings'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => {setQuery(item); handleSearch();}}
                  className="px-5 py-2 glass-card hover:text-white rounded-full text-zinc-500 text-xs font-bold uppercase tracking-widest transition-all active:scale-95"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-20 animate-bounce text-zinc-700">
               <ArrowDown className="w-5 h-5" />
            </div>
          </motion.div>
        )}
      </header>

      {/* Content Area */}
      <AnimatePresence>
        {status === AppStatus.SUCCESS && data && (
          <motion.main 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="container mx-auto px-4 pb-32 space-y-48 relative z-10"
          >
            {/* 1. Immersive Map Section */}
            <motion.section variants={itemVariants} className="scroll-mt-32">
              <WorldMap data={data} />
            </motion.section>

            {/* 2. Key Insights - Interactive Cards */}
            <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Origin Era', val: data.origin.era, icon: History, color: 'from-yellow-400/20 to-yellow-600/5', iconCol: 'text-yellow-500' },
                { label: 'Main Root', val: data.origin.location, icon: Globe2, color: 'from-blue-400/20 to-blue-600/5', iconCol: 'text-blue-500' },
                { label: 'Cultural Soul', val: data.culturalSignificance[0]?.region || 'Universal', icon: ChefHat, color: 'from-purple-400/20 to-purple-600/5', iconCol: 'text-purple-500' },
                { label: 'Global Reach', val: `${data.consumptionHubs.length} Major Hubs`, icon: Globe, color: 'from-emerald-400/20 to-emerald-600/5', iconCol: 'text-emerald-500' },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="interactive-card glass-card p-8 rounded-[2rem] relative overflow-hidden group border-white/5 shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                  <stat.icon className={`${stat.iconCol} mb-6 w-8 h-8 opacity-80`} />
                  <div className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-black mb-2">{stat.label}</div>
                  <div className="text-white text-2xl font-serif leading-tight">{stat.val}</div>
                </motion.div>
              ))}
            </motion.section>

            {/* 3. The Soul - Cultural Insights */}
            <motion.section variants={itemVariants}>
              <CulturalInsights insights={data.culturalSignificance} />
            </motion.section>

            {/* 4. Stats & Flavor Spectrum */}
            <motion.section variants={itemVariants}>
              <StatsSection data={data} />
            </motion.section>

            {/* 5. Evolution - Timeline */}
            <motion.section variants={itemVariants}>
              <EvolutionTimeline data={data} />
            </motion.section>

            {/* 6. Regional Adaptations */}
            <motion.section variants={itemVariants}>
              <RegionalVariations variations={data.regionalVariations} />
            </motion.section>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {status === AppStatus.ERROR && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-6 z-[200] bg-black/80 backdrop-blur-xl"
          >
            <div className="max-w-md glass-card p-12 text-center rounded-[3rem] border-red-900/20">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-8 animate-pulse" />
              <h3 className="text-2xl font-serif text-white mb-4">Archives Compromised</h3>
              <p className="text-zinc-500 mb-10 leading-relaxed">{error}</p>
              <button 
                onClick={() => setStatus(AppStatus.IDLE)}
                className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                Re-trace Steps
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="relative z-10 py-32 border-t border-zinc-900/50 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(#fff 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        <div className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em] mb-4">CulinaryChronicle Alpha-v1</div>
        <p className="text-zinc-600 text-xs mb-8">Intelligence via Gemini 3 • Deployment-Ready Architecture • Optimized for Vercel/GH-Pages</p>
        <div className="flex justify-center gap-6">
           <div className="w-8 h-[1px] bg-zinc-800"></div>
           <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
           <div className="w-8 h-[1px] bg-zinc-800"></div>
        </div>
      </footer>

      {/* Ultra-Modern Loading Overlay */}
      <AnimatePresence>
        {status === AppStatus.LOADING && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#020203] z-[1000] flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            <div className="relative mb-20 scale-125">
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="w-48 h-48 border-2 border-zinc-900 border-t-blue-600 border-b-purple-600 rounded-full blur-[1px] shadow-[0_0_50px_rgba(59,130,246,0.1)]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Utensils className="w-12 h-12 text-white" />
                </motion.div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h3 className="text-white text-3xl font-serif italic mb-6 tracking-tight">Accessing Global Repository...</h3>
              <div className="flex items-center justify-center gap-2">
                 <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
                 <p className="text-zinc-600 text-xs tracking-[0.3em] uppercase font-black">Syncing Node: {query.toUpperCase()}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
