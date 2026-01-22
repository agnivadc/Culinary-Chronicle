
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Bookmark } from 'lucide-react';
import { CulturalInsight } from '../types';

interface CulturalInsightsProps {
  insights: CulturalInsight[];
}

const CulturalInsights: React.FC<CulturalInsightsProps> = ({ insights }) => {
  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif text-white mb-2">The Soul of the Dish</h2>
        <p className="text-zinc-500">How this food weaves into the cultural fabric of its origins.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-zinc-900/60 p-8 rounded-3xl border border-zinc-800 hover:border-blue-500/50 transition-all duration-500"
          >
            <div className="absolute -top-4 -right-4 bg-blue-600 p-3 rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
              <Star className="text-white w-5 h-5" fill="currentColor" />
            </div>
            
            <div className="flex items-center gap-2 mb-6 text-zinc-500 text-xs font-bold uppercase tracking-widest">
              <Bookmark className="w-4 h-4" />
              <span>{insight.region}</span>
            </div>
            
            <h3 className="text-xl font-serif text-white mb-4 group-hover:text-blue-400 transition-colors">
              {insight.tradition}
            </h3>
            
            <p className="text-zinc-400 text-sm leading-relaxed italic">
              "{insight.meaning}"
            </p>
            
            <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between text-zinc-600">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Heritage Symbol</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CulturalInsights;
