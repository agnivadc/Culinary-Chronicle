
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FoodData } from '../types';
import FlavorRadar from './FlavorRadar';
import { motion } from 'framer-motion';

interface StatsSectionProps {
  data: FoodData;
}

const StatsSection: React.FC<StatsSectionProps> = ({ data }) => {
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
      {/* Flavor Profile - Large Card */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="lg:col-span-4 glass-card p-10 rounded-[3rem] flex flex-col items-center"
      >
        <div className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-black mb-10 text-center">Flavor DNA Analysis</div>
        <div className="w-full aspect-square relative">
          <FlavorRadar data={data.flavorProfile} />
          <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none"></div>
        </div>
        <p className="mt-8 text-zinc-500 text-[11px] leading-relaxed text-center italic opacity-60">
          Advanced Spectral analysis of aromatic compounds and historical taste preferences.
        </p>
      </motion.div>

      {/* Global Distribution - Medium Card */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="lg:col-span-4 glass-card p-10 rounded-[3rem] flex flex-col"
      >
        <div className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-black mb-10">Modern Global Share</div>
        <div className="w-full h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.consumptionHubs}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={10}
                dataKey="percentage"
                nameKey="country"
                stroke="none"
              >
                {data.consumptionHubs.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '15px' }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-white text-2xl font-black">{data.consumptionHubs.length}</div>
              <div className="text-zinc-600 text-[8px] uppercase tracking-widest font-bold">Regions</div>
            </div>
          </div>
        </div>
        <div className="mt-10 space-y-4">
          {data.consumptionHubs.map((hub, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{hub.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-700" style={{ width: `${hub.percentage}%` }}></div>
                </div>
                <span className="text-white font-mono text-xs">{hub.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Ingredient Evolution - Sidebar Card */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="lg:col-span-4 glass-card p-10 rounded-[3rem] flex flex-col"
      >
        <div className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-black mb-8">Evolutionary Shifts</div>
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 hide-scrollbar">
          {data.ingredientEvolution.map((item, idx) => (
            <div key={idx} className="relative pl-6 border-l border-zinc-800 group hover:border-blue-500/50 transition-colors">
              <div className="absolute top-0 left-[-4px] w-2 h-2 bg-zinc-800 rounded-full group-hover:bg-blue-500 transition-colors"></div>
              <div className="flex flex-col gap-1 mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-zinc-500 text-xs line-through italic opacity-50">{item.original}</span>
                    <span className="text-blue-500 text-xs">→</span>
                    <span className="text-white text-xs font-bold uppercase tracking-wider">{item.modern}</span>
                </div>
              </div>
              <p className="text-zinc-500 text-[11px] leading-relaxed group-hover:text-zinc-400 transition-colors">
                {item.reason}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-zinc-900 flex justify-center">
          <div className="px-6 py-2 bg-blue-500/5 border border-blue-500/20 rounded-full text-[9px] text-blue-500 uppercase font-black tracking-widest">
            Recipe Transformation Log
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsSection;
