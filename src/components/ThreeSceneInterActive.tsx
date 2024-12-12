'use client'

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";

const InteractiveScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const scene = new THREE.Scene();
        scene.background = new THREE.Color("white");

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 10;


        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current?.appendChild(renderer.domElement);


        const orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.enableDamping = true;


        const ambientLight = new THREE.PointLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);


        const objects: THREE.Object3D[] = [];
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        const createCube = (color: number, position: THREE.Vector3) => {
            const material = new THREE.MeshStandardMaterial({ color });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.copy(position);
            objects.push(cube);
            scene.add(cube);
        };

        createCube(0xff0000, new THREE.Vector3(-2, 0, 0));
        createCube(0x00ff00, new THREE.Vector3(2, 0, 0));
        createCube(0x0000ff, new THREE.Vector3(0, 2, 0));

        const dragControls = new DragControls(objects, camera, renderer.domElement);

        dragControls.addEventListener("dragstart", () => {
            orbitControls.enabled = false;
        });

        dragControls.addEventListener("dragend", () => {
            orbitControls.enabled = true;
        });

        // Raycaster
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let selectedObject: THREE.Object3D | null = null;

        const onMouseDown = (event: MouseEvent) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(objects);

            if (intersects.length > 0) {
                selectedObject = intersects[0].object;
            }
        };

        const onMouseMove = (event: MouseEvent) => {
            if (!selectedObject) return;

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const intersection = new THREE.Vector3();

            raycaster.ray.intersectPlane(plane, intersection);
            selectedObject.position.copy(intersection);


            objects.forEach((obj) => {
                if (selectedObject && obj !== selectedObject) {
                    const distance = obj.position.distanceTo(selectedObject.position);
                    if (distance < 1.5) {

                        const direction = new THREE.Vector3().subVectors(selectedObject.position, obj.position).normalize();
                        const correction = direction.multiplyScalar(1.5 - distance);
                        selectedObject.position.add(correction);
                    }
                }
            });
        };
        const onMouseUp = () => {
            selectedObject = null;
        };

        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);


        const animate = () => {
            requestAnimationFrame(animate);
            orbitControls.update();
            renderer.render(scene, camera);
        };
        animate();


        return () => {
            containerRef.current?.removeChild(renderer.domElement);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    return <div ref={containerRef} />;
};

export default InteractiveScene;
