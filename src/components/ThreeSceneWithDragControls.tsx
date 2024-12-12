'use client'

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";

const DraggableScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("white");

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 10;

        // Renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current?.appendChild(renderer.domElement);

        // OrbitControls
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.enableDamping = true;

        // Işık
        const ambientLight = new THREE.SpotLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        // Objeler
        const objects: THREE.Object3D[] = [];

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const material2 = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const material3 = new THREE.MeshStandardMaterial({ color: 0x0000ff });

        const cube1 = new THREE.Mesh(geometry, material1);
        const cube2 = new THREE.Mesh(geometry, material2);
        const cube3 = new THREE.Mesh(geometry, material3);

        cube1.position.set(-2, 0, 0);
        cube2.position.set(2, 0, 0);
        cube3.position.set(0, 2, 0);

        objects.push(cube1, cube2, cube3);
        scene.add(cube1, cube2, cube3);

        // DragControls
        const dragControls = new DragControls(objects, camera, renderer.domElement);

        // Drag Events
        dragControls.addEventListener("dragstart", (event) => {
            orbitControls.enabled = false; // OrbitControls'u devre dışı bırak
        });

        dragControls.addEventListener("dragend", (event) => {
            orbitControls.enabled = true; // OrbitControls'u tekrar etkinleştir
        });

        // Animasyon
        const animate = () => {
            requestAnimationFrame(animate);
            orbitControls.update();
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

export default DraggableScene;
