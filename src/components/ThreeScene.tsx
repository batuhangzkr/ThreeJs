'use client'

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scene
        // Sahne
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000); // Arka plan rengi siyah

        // Kamera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 5);

        // Renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current?.appendChild(renderer.domElement);

        // Geometri ve Materyal
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ color: "red" });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Işıklar
        const light = new THREE.SpotLight(0xffffff);
        light.position.set(10, 10, 10);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Animasyon
        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();


        // Cleanup
        return () => {
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} />;
};

export default ThreeScene;
