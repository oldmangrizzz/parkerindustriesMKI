import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SwarmAgent {
  id: string;
  x: number;
  y: number;
  type: string;
}

interface SwarmVisualizationProps {
  data: SwarmAgent[];
}

const SwarmVisualization: React.FC<SwarmVisualizationProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    const width = 400;
    const height = 300;

    svg.attr('width', width).attr('height', height);

    const simulation = d3.forceSimulation(data)
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(10));

    const nodes = svg.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('r', 5)
      .attr('fill', d => d.type === 'leader' ? '#ff0000' : '#00ff00');

    simulation.on('tick', () => {
      nodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });

  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Swarm Visualization</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default SwarmVisualization;