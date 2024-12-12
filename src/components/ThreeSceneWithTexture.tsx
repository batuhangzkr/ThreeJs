'use client'

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const ThreeScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('white')

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;


        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current?.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.keys = {
            LEFT: 'ArrowLeft',
            UP: 'ArrowUp',
            RIGHT: 'ArrowRight',
            BOTTOM: 'ArrowDown'

        }
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
        }
        controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        }

        const light = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(light);


        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load("/textures/brick.jpg");


        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.set(3, 3);
        texture.offset.set(0.1, 0.1);


        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ map: texture });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        let offsetX = 0;

        const animate = () => {
            requestAnimationFrame(animate);


            offsetX += 0.01;
            texture.offset.set(offsetX, 0);


            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        };
        animate();


        return () => {
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} />;
};

export default ThreeScene;
