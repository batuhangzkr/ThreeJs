'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js';

const InteractiveScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('skyblue');

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 20);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current?.appendChild(renderer.domElement);

        const orbitControls = new OrbitControls(camera, renderer.domElement);


        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);


        const objects: THREE.Object3D[] = [];

        const createCube = (color: number, position: THREE.Vector3) => {
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshStandardMaterial({ color });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.copy(position);
            objects.push(cube);
            scene.add(cube);
        };


        createCube(0xff0000, new THREE.Vector3(-3, 0, 0));
        createCube(0x00ff00, new THREE.Vector3(3, 0, 0));
        createCube(0x0000ff, new THREE.Vector3(0, 0, 3));


        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        let selectedObject: THREE.Object3D | null = null;
        let initialClickPosition: THREE.Vector3 | null = null;


        const dragControls = new DragControls(objects, camera, renderer.domElement);
        dragControls.addEventListener('dragstart', () => {
            orbitControls.enabled = false;
        });

        dragControls.addEventListener('dragend', () => {
            orbitControls.enabled = true;
        });


        const onMouseClick = (event: MouseEvent) => {

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;


            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(objects);

            if (intersects.length > 0) {
                const selectedObject = intersects[0].object as THREE.Mesh;
                const material = selectedObject.material as THREE.MeshStandardMaterial;

                material.color.set(Math.random() * 0xffffff);
            }
        };
        const fontLoader = new FontLoader();
        fontLoader.load("/fonts/Agency FB_Bold.json", (font) => {
            const textGeometry = new TextGeometry("Çarpısma olunca çarpısan küpler kırmızıya döner ve birbirini ötelerler", {
                font: font,
                size: 0.8,
                height: 0.01,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 5,
            });

            const textMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            textMesh.position.set(-14, 10, 0);
            textMesh.rotation.set(0, 0, 0);

            scene.add(textMesh);
        });

        window.addEventListener('click', onMouseClick);


        const onMouseDown = (event: MouseEvent) => {

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;


            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(objects);

            if (intersects.length > 0) {
                selectedObject = intersects[0].object;
                const intersectPoint = intersects[0].point;
                initialClickPosition = intersectPoint.clone();
            }
        };

        const onMouseMove = (event: MouseEvent) => {
            if (selectedObject && initialClickPosition) {

                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects([selectedObject]);

                if (intersects.length > 0) {
                    const currentPoint = intersects[0].point;
                    const axis = new THREE.Vector3(0, 1, 0);
                    const angle = currentPoint.clone().sub(initialClickPosition).length() * 0.1;

                    selectedObject.rotateOnAxis(axis, angle);
                    initialClickPosition = currentPoint.clone();
                }
            }
        };

        const onMouseUp = () => {
            selectedObject = null;
            initialClickPosition = null;
        };


        const checkCollisions = () => {
            for (let i = 0; i < objects.length; i++) {
                for (let j = i + 1; j < objects.length; j++) {
                    const objA = objects[i] as THREE.Mesh;
                    const objB = objects[j] as THREE.Mesh;
                    const distance = objA.position.distanceTo(objB.position);
                    if (distance < 2.5) {
                        console.log('Collision detected between', objA, 'and', objB);
                        const materialA = objA.material as THREE.MeshStandardMaterial;
                        const materialB = objB.material as THREE.MeshStandardMaterial;
                        materialA.color.set(0xff0000);
                        materialB.color.set(0xff0000);


                        const overlap = 2.5 - distance;
                        const direction = new THREE.Vector3().subVectors(objA.position, objB.position).normalize();
                        objA.position.add(direction.multiplyScalar(overlap / 2));
                        objB.position.add(direction.multiplyScalar(-overlap / 2));
                    }
                }
            }
        };

        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);


        const animate = () => {
            requestAnimationFrame(animate);
            checkCollisions();
            orbitControls.update();
            renderer.render(scene, camera);
        };

        animate();


        return () => {
            containerRef.current?.removeChild(renderer.domElement);
            window.removeEventListener('click', onMouseClick);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return <div ref={containerRef} />;
};

export default InteractiveScene;