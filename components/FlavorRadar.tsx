
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface FlavorRadarProps {
  data: {
    sweet: number;
    savory: number;
    spicy: number;
    sour: number;
    bitter: number;
  };
}

const FlavorRadar: React.FC<FlavorRadarProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = 300;
    const height = 300;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(containerRef.current)
      .html('')
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const features = ['Sweet', 'Savory', 'Spicy', 'Sour', 'Bitter'];
    const radarData = [
      data.sweet,
      data.savory,
      data.spicy,
      data.sour,
      data.bitter
    ];

    const angleSlice = (Math.PI * 2) / features.length;
    const rScale = d3.scaleLinear().domain([0, 10]).range([0, radius]);

    // Draw background circles
    const levels = [2, 4, 6, 8, 10];
    svg.selectAll('.levels')
      .data(levels)
      .enter()
      .append('circle')
      .attr('r', d => rScale(d))
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-dasharray', '4,4');

    // Draw axes
    const axes = svg.selectAll('.axis')
      .data(features)
      .enter()
      .append('g');

    axes.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(10) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(10) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('stroke', '#222');

    axes.append('text')
      .attr('x', (d, i) => rScale(12) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(12) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('text-anchor', 'middle')
      .attr('fill', '#71717a')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('dy', '0.35em')
      .text(d => d.toUpperCase());

    // Radar Line Generator
    const radarLine = d3.lineRadial<number>()
      .radius(d => rScale(d))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    // Initial path (zeroed)
    const blob = svg.append('path')
      .datum(radarData.map(() => 0))
      .attr('d', radarLine as any)
      .attr('fill', '#3b82f6')
      .attr('fill-opacity', 0.2)
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2);

    // Animate to final values
    blob.transition()
      .duration(1500)
      .ease(d3.easeElasticOut)
      .attr('d', radarLine(radarData) as any)
      .attr('fill-opacity', 0.6);

    // Add glowing dots
    svg.selectAll('.dot')
      .data(radarData)
      .enter()
      .append('circle')
      .attr('r', 4)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('fill', '#3b82f6')
      .transition()
      .duration(1500)
      .ease(d3.easeElasticOut)
      .attr('cx', (d, i) => rScale(d) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d) * Math.sin(angleSlice * i - Math.PI / 2));

  }, [data]);

  return <div ref={containerRef} className="w-full h-full"></div>;
};

export default FlavorRadar;
