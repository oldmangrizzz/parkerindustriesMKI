import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SwarmAgent {
  id: string;
  position: [number, number, number];
}

interface ModelInsight {
  id: string;
  position: [number, number, number];
  color: string;
  size: number;
}

interface VFusion3DViewProps {
  swarmData: SwarmAgent[];
  modelInsights: ModelInsight[];
}

const VFusion3DView: React.FC<VFusion3DViewProps> = ({ swarmData, modelInsights }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const agentsRef = useRef<{ [key: string]: THREE.Mesh }>({});
  const insightsRef = useRef<{ [key: string]: THREE.Mesh }>({});

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Clean up
    return () => {
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Update or create agents
    swarmData.forEach((agent) => {
      if (agentsRef.current[agent.id]) {
        agentsRef.current[agent.id].position.set(...agent.position);
      } else {
        const geometry = new THREE.SphereGeometry(0.1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...agent.position);
        sceneRef.current!.add(mesh);
        agentsRef.current[agent.id] = mesh;
      }
    });

    // Update or create model insights
    modelInsights.forEach((insight) => {
      if (insightsRef.current[insight.id]) {
        const mesh = insightsRef.current[insight.id];
        mesh.position.set(...insight.position);
        mesh.scale.setScalar(insight.size);
        (mesh.material as THREE.MeshBasicMaterial).color.setStyle(insight.color);
      } else {
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const material = new THREE.MeshBasicMaterial({ color: insight.color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...insight.position);
        mesh.scale.setScalar(insight.size);
        sceneRef.current!.add(mesh);
        insightsRef.current[insight.id] = mesh;
      }
    });

    // Remove unused agents and insights
    Object.keys(agentsRef.current).forEach((id) => {
      if (!swarmData.find((agent) => agent.id === id)) {
        sceneRef.current!.remove(agentsRef.current[id]);
        delete agentsRef.current[id];
      }
    });

    Object.keys(insightsRef.current).forEach((id) => {
      if (!modelInsights.find((insight) => insight.id === id)) {
        sceneRef.current!.remove(insightsRef.current[id]);
        delete insightsRef.current[id];
      }
    });
  }, [swarmData, modelInsights]);

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
};

export default VFusion3DView;