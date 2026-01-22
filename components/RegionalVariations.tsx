
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, Flame } from 'lucide-react';
import { RegionalVariation } from '../types';

interface RegionalVariationsProps {
  variations: RegionalVariation[];
}

const RegionalVariations: React.FC<RegionalVariationsProps> = ({ variations }) => {
  return (
    <div className="py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">Global Adaptations</h2>
          <p className="text-zinc-500">From local traditions to bold modern fusions.</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800 text-xs text-zinc-400">
          <Zap className="text-yellow-500 w-4 h-4" />
          <span>Showing {variations.length} distinct variations</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {variations.map((variant, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row bg-zinc-900/40 rounded-[2.5rem] border border-zinc-800 overflow-hidden hover:bg-zinc-900/60 transition-colors group"
          >
            <div className="md:w-1/3 bg-zinc-800 flex items-center justify-center p-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-center z-10">
                <Flame className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-50" />
                <span className="text-white font-bold text-lg block">{variant.name}</span>
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{variant.popularity}</span>
              </div>
            </div>
            
            <div className="flex-1 p-8">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-4">
                <MapPin className="w-3 h-3" />
                <span>{variant.region}</span>
              </div>
              
              <h4 className="text-white font-bold mb-3">Key Adaptation</h4>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                {variant.keyDifference}
              </p>
              
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-900/20 text-blue-400 text-[10px] font-bold rounded-full border border-blue-900/30 uppercase">Modern</span>
                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-full border border-zinc-700 uppercase tracking-tighter">Regional Fusion</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RegionalVariations;
