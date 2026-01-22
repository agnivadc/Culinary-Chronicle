
import React from 'react';
import { motion } from 'framer-motion';
import { FoodData } from '../types';
import { Calendar, MapPin } from 'lucide-react';

interface EvolutionTimelineProps {
  data: FoodData;
}

const EvolutionTimeline: React.FC<EvolutionTimelineProps> = ({ data }) => {
  return (
    <div className="py-24 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-8">
        <div className="max-w-xl">
          <h2 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">Timeline of <span className="text-zinc-500 italic">Civilization</span></h2>
          <p className="text-zinc-500 text-lg leading-relaxed">Tracing {data.foodName} from ancient rituals to global industrialization.</p>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900/40 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
            <Calendar className="text-blue-500 w-8 h-8" />
            <div>
                <div className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Historical Span</div>
                <div className="text-white font-bold">{data.origin.era} — Present</div>
            </div>
        </div>
      </div>

      <div className="relative">
        {/* Glowing Central Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[1px] bg-gradient-to-b from-blue-500/0 via-blue-500/30 to-blue-500/0"></div>

        <div className="space-y-32">
          {/* Origin Card */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative flex flex-col md:flex-row items-center gap-12"
          >
            <div className="md:w-1/2 md:text-right">
              <div className="inline-block px-4 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-4">The Genesis</div>
              <h4 className="text-white font-serif text-3xl mb-2">{data.origin.era}</h4>
              <div className="flex items-center md:justify-end gap-2 text-zinc-500 font-bold text-xs uppercase tracking-widest mb-4">
                <MapPin className="w-3 h-3" />
                <span>{data.origin.location}</span>
              </div>
            </div>
            
            <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-yellow-500 shadow-[0_0_25px_#eab308] border-[6px] border-[#020203] z-10"></div>
            
            <div className="md:w-1/2 glass-card p-10 rounded-[3rem] relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-zinc-400 leading-relaxed text-lg italic">
                    "{data.origin.summary}"
                </p>
            </div>
          </motion.div>

          {/* Evolution Steps */}
          {data.evolutionSteps.map((step, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative flex flex-col items-center gap-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
            >
              <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                <div className="inline-block px-4 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4">Milestone {idx + 1}</div>
                <h4 className="text-white font-serif text-3xl mb-2">{step.year}</h4>
                <div className={`flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-widest mb-4 ${idx % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                    <MapPin className="w-3 h-3" />
                    <span>{step.location}</span>
                </div>
              </div>

              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6] border-[4px] border-[#020203] z-10 transition-transform group-hover:scale-125"></div>

              <div className="md:w-1/2 glass-card p-10 rounded-[3rem] relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h3 className="text-white text-xl font-bold mb-4 tracking-tight group-hover:text-blue-400 transition-colors">{step.event}</h3>
                <p className="text-zinc-400 leading-relaxed">
                    {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* End of Journey */}
        <div className="flex justify-center mt-32 relative">
             <div className="px-10 py-4 glass-card rounded-full text-white font-black uppercase tracking-[0.4em] text-[10px] border border-white/10">
                End of Archives
             </div>
        </div>
      </div>
    </div>
  );
};

export default EvolutionTimeline;
