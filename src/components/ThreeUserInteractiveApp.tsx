'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

interface SceneComponentProps {
    onSetFunctions: (functions: {
        addCube: () => void;
        addSphere: () => void;
        addPlane: () => void;
        addText: (text: string) => void;
        deleteText: () => void;
        addTexture: (file: File) => void;
        deleteObject: () => void
    }) => void;
}

const SceneComponent: React.FC<SceneComponentProps> = ({ onSetFunctions }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const orbitControlsRef = useRef<OrbitControls | null>(null);
    const dragControlsRef = useRef<DragControls | null>(null);

    const [objects, setObjects] = useState<THREE.Object3D[]>([]);
    const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
    const xOffset = 3;
    let currentXPosition = 0;

    const initScene = useCallback(() => {
        if (sceneRef.current || rendererRef.current || cameraRef.current) {
            return;
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('white');
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(10, 10, 20);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        rendererRef.current = renderer;

        if (containerRef.current) {
            containerRef.current.appendChild(renderer.domElement);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshStandardMaterial({ color: 'green' })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        const orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControlsRef.current = orbitControls;

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
    }, []);

    const addShape = useCallback((geometry: THREE.BufferGeometry) => {
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.set(currentXPosition, 1, 0);
        currentXPosition += xOffset;

        sceneRef.current!.add(mesh);
        setObjects((prev) => [...prev, mesh]);
    }, []);

    const addTextToScene = useCallback((text: string) => {
        const fontLoader = new FontLoader();
        fontLoader.load('/fonts/Agency FB_Bold.json', (font) => {
            // Genel TextGeometry tanımı
            const textGeometry = new TextGeometry(text, {
                font,
                size: 0.5,
                height: 0.1,
            });
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.castShadow = true;

            if (selectedObject && selectedObject instanceof THREE.Mesh) {
                const bbox = new THREE.Box3().setFromObject(selectedObject);
                const size = bbox.getSize(new THREE.Vector3());

                // Metni seçilen nesnenin hemen üstünde ve aynı X-Z ekseninde konumlandır
                textMesh.position.set(
                    currentXPosition - 1,
                    selectedObject.position.y + 0.1, // Y ekseninde üstte
                    selectedObject.position.z // Z ekseni aynı
                );

                textMesh.rotation.copy(selectedObject.rotation); // Rotasyon uyumlu
                selectedObject.add(textMesh); // Nesneye ekle
            } else {
                // Farklı bir TextGeometry ve Material tanımı
                const largeTextGeometry = new TextGeometry(text, {
                    font,
                    size: 1.5, // Daha büyük boyut
                    height: 0.2,
                });
                const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Kırmızı renk
                const largeTextMesh = new THREE.Mesh(largeTextGeometry, redMaterial);
                largeTextMesh.castShadow = true;

                largeTextMesh.position.set(currentXPosition, 2, 0);
                currentXPosition += xOffset;
                sceneRef.current!.add(largeTextMesh);

                // Nesne dizisine büyük metni ekle
                setObjects((prev) => [...prev, largeTextMesh]);
            }

            // Tüm nesneler (metinler dahil) seçim yapılabilir olmalı
            setObjects((prev) => [...prev, textMesh]);
        });
    }, [selectedObject]);


    const deleteTextFromObject = useCallback(() => {
        if (selectedObject && selectedObject instanceof THREE.Mesh) {
            const textChildren = selectedObject.children.filter(
                (child) => child instanceof THREE.Mesh && child.geometry instanceof TextGeometry
            );

            textChildren.forEach((child) => {
                selectedObject.remove(child);
            });

            console.log('Text silindi.');
        } else {
            console.warn('Text silmek için bir nesne seçin.');
        }
    }, [selectedObject]);


    const deleteObject = useCallback(() => {
        if (selectedObject) {
            // Sahneden objeyi kaldır
            setObjects((prev) => prev.filter((obj) => obj !== selectedObject));
            sceneRef.current?.remove(selectedObject);

            // Objects listesinden objeyi kaldır

            console.log('Object silindi:', selectedObject);
            setSelectedObject(null); // Seçimi sıfırla
        } else {
            console.warn('Silmek için bir obje seçin.');
        }
    }, [selectedObject]);

    const addTextureToObject = useCallback((file: File) => {
        const url = URL.createObjectURL(file);
        const textureLoader = new THREE.TextureLoader();

        textureLoader.load(
            url,
            (texture) => {
                if (selectedObject && selectedObject instanceof THREE.Mesh) {
                    selectedObject.material = new THREE.MeshStandardMaterial({ map: texture });
                } else {
                    console.warn('No object selected to apply texture.');
                }
            },
            undefined,
            (error) => {
                console.error('Texture load error:', error);
            }
        );
    }, [selectedObject]);

    const highlightObject = useCallback((object: THREE.Object3D) => {
        if (object instanceof THREE.Mesh) {
            object.userData.originalMaterial = object.material;
            object.material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0.3,
            });
        }
    }, []);

    const removeHighlight = useCallback((object: THREE.Object3D) => {
        if (object instanceof THREE.Mesh && object.userData.originalMaterial) {
            object.material = object.userData.originalMaterial;
            delete object.userData.originalMaterial;
        }
    }, []);

    useEffect(() => {
        initScene();
    }, [initScene]);

    useEffect(() => {
        if (!cameraRef.current || !rendererRef.current) return;
        dragControlsRef.current?.dispose();
        const dragControls = new DragControls(objects, cameraRef.current, rendererRef.current.domElement);


        dragControls.addEventListener('dragstart', (event) => {
            orbitControlsRef.current!.enabled = false;
            highlightObject(event.object);
            setSelectedObject(event.object);
        });

        dragControls.addEventListener('dragend', (event) => {
            orbitControlsRef.current!.enabled = true;
            removeHighlight(event.object);
        });

        dragControlsRef.current = dragControls;
    }, [objects, highlightObject, removeHighlight]);

    useEffect(() => {
        onSetFunctions({
            addCube: () => addShape(new THREE.BoxGeometry(2, 2, 2)),
            addSphere: () => addShape(new THREE.SphereGeometry(1.5, 32, 32)),
            addPlane: () => addShape(new THREE.PlaneGeometry(4, 4)),
            addText: addTextToScene,
            deleteText: deleteTextFromObject,
            addTexture: addTextureToObject,
            deleteObject: deleteObject,
        });
    }, [addShape, addTextToScene, deleteObject, deleteTextFromObject, addTextureToObject, onSetFunctions]);

    return <div ref={containerRef} />;
};

export default SceneComponent;
