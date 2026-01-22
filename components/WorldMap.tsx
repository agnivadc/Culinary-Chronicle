
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { RotateCw, Maximize2 } from 'lucide-react';
import { FoodData } from '../types';

interface WorldMapProps {
  data: FoodData;
}

const WorldMap: React.FC<WorldMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const timerRef = useRef<d3.Timer | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 650;
    const sensitivity = 75;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto');

    svg.selectAll('*').remove();

    // Atmosphere Glow
    const defs = svg.append('defs');
    const radialGradient = defs.append('radialGradient')
      .attr('id', 'atmosphere-glow')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    radialGradient.append('stop').attr('offset', '80%').attr('stop-color', '#000000').attr('stop-opacity', 0);
    radialGradient.append('stop').attr('offset', '100%').attr('stop-color', '#3b82f6').attr('stop-opacity', 0.1);

    const projection = d3.geoOrthographic()
      .scale(280)
      .center([0, 0])
      .rotate([0, -15])
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection);

    // Ocean Base
    svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', projection.scale())
      .attr('fill', '#050507')
      .attr('stroke', '#1a1a24')
      .attr('stroke-width', 2);

    // Atmosphere layer
    svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', projection.scale() + 10)
      .attr('fill', 'url(#atmosphere-glow)')
      .attr('pointer-events', 'none');

    const graticuleGroup = svg.append('g').attr('class', 'graticule-layer');
    const countriesGroup = svg.append('g').attr('class', 'countries-layer');
    const arcsGroup = svg.append('g').attr('class', 'arcs-layer');
    const markersGroup = svg.append('g').attr('class', 'markers-layer');

    const graticule = d3.geoGraticule();
    graticuleGroup.append('path')
      .datum(graticule)
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', '#13131a')
      .attr('stroke-width', 0.5);

    const updateElements = () => {
      svg.selectAll('path').attr('d', path as any);
      const rotate = projection.rotate();
      const center: [number, number] = [-rotate[0], -rotate[1]];

      markersGroup.selectAll('.marker-point').each(function(d: any) {
        const isVisible = d3.geoDistance(d, center) < Math.PI / 2.1; // Slightly tighter clip
        const pos = projection(d);
        if (isVisible && pos) {
          d3.select(this).style('display', 'inline').attr('cx', pos[0]).attr('cy', pos[1]);
        } else {
          d3.select(this).style('display', 'none');
        }
      });

      markersGroup.selectAll('.marker-label').each(function(d: any) {
        const isVisible = d3.geoDistance(d, center) < Math.PI / 2.1;
        const pos = projection(d);
        if (isVisible && pos) {
          d3.select(this).style('display', 'inline').attr('x', pos[0]).attr('y', pos[1] - 15);
        } else {
          d3.select(this).style('display', 'none');
        }
      });
    };

    const drag = d3.drag<SVGSVGElement, unknown>()
      .on('start', () => setIsRotating(false))
      .on('drag', (event) => {
        const rotate = projection.rotate();
        const k = sensitivity / projection.scale();
        projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
        updateElements();
      });

    svg.call(drag as any);

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((worldData: any) => {
      if (!worldData) return;
      const countries = (feature(worldData, worldData.objects.countries) as any).features;

      countriesGroup.selectAll('path')
        .data(countries)
        .enter()
        .append('path')
        .attr('d', path as any)
        .attr('fill', '#0f0f14')
        .attr('stroke', '#22222b')
        .attr('stroke-width', 0.5)
        .on('mouseover', function() { d3.select(this).attr('fill', '#1a1a24'); })
        .on('mouseout', function() { d3.select(this).attr('fill', '#0f0f14'); });

      setMapLoaded(true);

      const originPos: [number, number] = [data.origin.coordinates.lng, data.origin.coordinates.lat];
      const hubPoints = data.consumptionHubs.map(h => [h.coordinates.lng, h.coordinates.lat] as [number, number]);
      const evolutionPoints = data.evolutionSteps.map(s => [s.coordinates.lng, s.coordinates.lat] as [number, number]);

      // Draw High-Contrast Arcs
      let current = originPos;
      [...evolutionPoints].forEach((p, i) => {
        const arc = { type: 'LineString', coordinates: [current, p] };
        arcsGroup.append('path')
          .datum(arc)
          .attr('class', 'migration-arc')
          .attr('fill', 'none')
          .attr('stroke', '#3b82f6')
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '5,5')
          .attr('opacity', 0.7);
        current = p;
      });

      // Interactive Origin Marker
      const originMarker = markersGroup.append('g').datum(originPos);
      
      originMarker.append('circle')
        .attr('class', 'marker-point')
        .attr('r', 8)
        .attr('fill', '#eab308')
        .attr('stroke', '#000')
        .attr('stroke-width', 2);

      originMarker.append('text')
        .attr('class', 'marker-label')
        .attr('text-anchor', 'middle')
        .attr('fill', '#eab308')
        .attr('font-size', '11px')
        .attr('font-weight', '900')
        .attr('letter-spacing', '0.1em')
        .text('BIRTHPLACE');

      // Hub points with "heat" effect
      hubPoints.forEach(p => {
        markersGroup.append('circle')
          .datum(p)
          .attr('class', 'marker-point animate-pulse')
          .attr('r', 10)
          .attr('fill', '#ef4444')
          .attr('fill-opacity', 0.3)
          .attr('stroke', '#ef4444')
          .attr('stroke-width', 1.5);
      });

      updateElements();

      // Cinematic Intro
      d3.transition()
        .duration(2500)
        .ease(d3.easeCubicOut)
        .tween('rotate', () => {
          const r = d3.interpolate(projection.rotate(), [-originPos[0], -originPos[1] + 10]);
          return (t) => {
            projection.rotate(r(t));
            updateElements();
          };
        });
    });

    if (isRotating) {
      timerRef.current = d3.timer(() => {
        const rotate = projection.rotate();
        projection.rotate([rotate[0] + 0.15, rotate[1]]);
        updateElements();
      });
    }

    return () => {
      if (timerRef.current) timerRef.current.stop();
    };
  }, [data, isRotating]);

  return (
    <div className="relative w-full aspect-square md:aspect-[21/9] bg-zinc-950/20 rounded-[4rem] border border-white/5 shadow-2xl flex items-center justify-center overflow-hidden">
      {!mapLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-3xl z-20">
          <div className="w-12 h-12 border-2 border-zinc-800 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em]">Calibrating Geography</span>
        </div>
      )}

      {/* Floating UI */}
      <div className="absolute top-12 left-12 z-10 pointer-events-none max-w-sm">
        <h3 className="text-white text-3xl font-serif italic mb-3">Global Migration</h3>
        <p className="text-zinc-500 text-sm leading-relaxed mb-8 opacity-80">
          Behold the path of {data.foodName}. From its ancestral home in {data.origin.location} to the modern global table.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-zinc-900/30 backdrop-blur-md p-3 rounded-2xl border border-white/5">
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_15px_#eab308]"></div>
            <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Origin Point</span>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/30 backdrop-blur-md p-3 rounded-2xl border border-white/5">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6]"></div>
            <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Expansion Trail</span>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/30 backdrop-blur-md p-3 rounded-2xl border border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_15px_#ef4444]"></div>
            <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Consumption Hubs</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 flex items-center gap-4 z-10">
        <button 
          onClick={() => setIsRotating(!isRotating)}
          className={`group flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-500 ${isRotating ? 'bg-white text-black border-white' : 'bg-zinc-950/50 text-zinc-400 border-zinc-800 hover:border-zinc-600'}`}
        >
          <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          <span className="text-[10px] font-black uppercase tracking-widest">{isRotating ? 'Auto' : 'Manual'}</span>
        </button>
      </div>

      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing opacity-90"></svg>
    </div>
  );
};

export default WorldMap;
