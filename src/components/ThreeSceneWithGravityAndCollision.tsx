'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import { DragControls } from 'three/examples/jsm/Addons.js';

const PhysicsScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('skyblue');

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, 10);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current?.appendChild(renderer.domElement);

        const orbitControls = new OrbitControls(camera, renderer.domElement);


        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);



        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);


        const groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        });
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // yatay zemin
        world.addBody(groundBody);


        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x008800 });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = -Math.PI / 2;
        scene.add(groundMesh);

        // Cannon.js - Küp
        const cubeBody = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
            position: new CANNON.Vec3(0, 10, 0), // Birinci küp
        });
        world.addBody(cubeBody);

        const cubeBody2 = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
            position: new CANNON.Vec3(3, 10, 0), // İkinci küp
        });
        world.addBody(cubeBody2);

        const objects: THREE.Object3D[] = [];
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        const cubeGeometry2 = new THREE.BoxGeometry(2, 2, 2);
        const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const cubeMaterial2 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
        const cubeMesh2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2);
        cubeMesh.position.set(3, 10, 0)
        cubeMesh2.position.set(0, 10, 0)
        objects.push(cubeMesh, cubeMesh2);
        scene.add(cubeMesh)
        scene.add(cubeMesh2)

        const dragControls = new DragControls(objects, camera, renderer.domElement);

        let isDragging = false;

        dragControls.addEventListener('dragstart', (event) => {
            isDragging = true;
            orbitControls.enabled = false;

            if (event.object === cubeMesh) {
                cubeBody.sleep();
            } else if (event.object === cubeMesh2) {
                cubeBody2.sleep();
            }
        });

        dragControls.addEventListener('drag', (event) => {
            if (event.object === cubeMesh) {
                cubeBody.position.set(event.object.position.x, event.object.position.y, event.object.position.z);
            } else if (event.object === cubeMesh2) {
                cubeBody2.position.set(event.object.position.x, event.object.position.y, event.object.position.z);
            }
        });

        dragControls.addEventListener('dragend', (event) => {
            isDragging = false;
            orbitControls.enabled = true;

            if (event.object === cubeMesh) {
                cubeBody.wakeUp();
            } else if (event.object === cubeMesh2) {
                cubeBody2.wakeUp();
            }
        });



        const animate = () => {
            requestAnimationFrame(animate);

            if (!isDragging) {
                world.step(1 / 60); // Fizik motoru güncellenir
            }

            // Cannon.js -> Three.js Pozisyon Senkronizasyonu
            cubeMesh.position.copy(cubeBody.position as any);
            cubeMesh.quaternion.copy(cubeBody.quaternion as any);

            cubeMesh2.position.copy(cubeBody2.position as any);
            cubeMesh2.quaternion.copy(cubeBody2.quaternion as any);

            orbitControls.update();
            renderer.render(scene, camera);
        };


        animate();

        return () => {
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} />;
};

export default PhysicsScene;
