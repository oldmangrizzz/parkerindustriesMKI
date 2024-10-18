import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN } from '../config/env';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // Default to New York
      zoom: 9
    });

    // Clean up on unmount
    return () => map.current?.remove();
  }, []);

  return <div ref={mapContainer} className="h-[400px] w-full rounded-lg" />;
};

export default MapView;