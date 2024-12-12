'use client'

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const ThreeScene: React.FC = () => {
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
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // Daha yumuşak bir hareket
        controls.dampingFactor = 0.1; // Damping oranı
        controls.maxDistance = 50; // Maksimum yakınlaştırma
        controls.minDistance = 5; // Minimum uzaklaştırma

        // Işıklar
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        // Doku ve Küp
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load("/textures/brick.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.set(3, 3);
        texture.offset.set(0.1, 0.1);

        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        const cubeMaterial = new THREE.MeshStandardMaterial({ map: texture });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, -4, 0);
        scene.add(cube);

        // FontLoader ile Metin
        const fontLoader = new FontLoader();
        fontLoader.load("/fonts/Agency FB_Bold.json", (font) => {
            const textGeometry = new TextGeometry("Bu Bir Küp!", {
                font: font,
                size: 4,
                height: 0.3,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 5,
            });

            const textMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            textMesh.position.set(-10, 0, 0);
            textMesh.rotation.set(0, 0, 0);

            scene.add(textMesh);
        });

        // Animasyon Döngüsü
        const animate = () => {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            controls.update(); // OrbitControls için güncelleme
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
