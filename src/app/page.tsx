'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SinglePage = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current || rendererRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#04041b');

    const camera = new THREE.PerspectiveCamera(
      100,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: '#4A90E2' });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = containerRef.current!.clientWidth / containerRef.current!.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current!.clientWidth, containerRef.current!.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      rendererRef.current = null;
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#04041b] text-white">
      <h1 className="text-3xl font-bold mb-6">Three.js Taskım</h1>

      <div
        ref={containerRef}
        className="w-full h-96 md:w-3/4 md:h-96 border border-gray-700"
      ></div>

      <div className="flex space-x-4 mt-8">
        <button
          onClick={() => router.push('/tasks')}
          className="bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded"
        >
          Görevler Sayfası
        </button>
      </div>
    </div>
  );
};

export default SinglePage;
