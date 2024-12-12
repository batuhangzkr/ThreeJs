'use client'

import { useEffect, useRef } from "react"
import * as THREE from 'three'
import { GLTFLoader, OBJLoader, OrbitControls } from "three/examples/jsm/Addons.js";

export const boxscene = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xcccccc); // Arka plan reng
        const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.01, 1000);


        camera.position.set(10, 10, 10)
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight)
        containerRef.current?.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.keys = {
            LEFT: 'ArrowLeft', //left arrow
            UP: 'ArrowUp', // up arrow
            RIGHT: 'ArrowRight', // right arrow
            BOTTOM: 'ArrowDown' // down arrow

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
        //controls.update() must be called after any manual changes to the camera's transform

        camera.position.set(0, 20, 100);
        controls.update();
        let model: THREE.Object3D;
        const loader = new OBJLoader();
        loader.load(
            "/models/78011.obj", // Model dosyasının yolu
            (object) => {
                object.position.set(0, 0, 0); // Modelin pozisyonunu ayarla
                object.scale.set(1, 1, 1); // Modelin ölçeğini ayarla

                // Modeli tarayarak materyalini değiştir
                object.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh;
                        mesh.material = new THREE.MeshStandardMaterial({ color: 'black' }); // Yeşil renk
                    }
                });

                model = object; // Modeli sahneye ekle
                scene.add(model)
            },
            (xhr) => {
                console.log(`Model yükleniyor: ${(xhr.loaded / xhr.total) * 100}% tamamlandı.`);
            },
            (error) => {
                console.error("Model yüklenirken bir hata oluştu:", error);
            }
        );




        const light = new THREE.AmbientLight(0xffffff);
        light.position.set(10, 10, 10);
        scene.add(light)

        let angle = 0; // Dönüş açısını takip etmek için bir değişken

        const animate = () => {
            requestAnimationFrame(animate);

            if (model) {
                // Dönme açısını artır
                angle += 0.04; // Hızı ayarlamak için bu değeri artırabilir veya azaltabilirsiniz

                // Modeli bir daire etrafında döndür
                const radius = 100; // Dairenin yarıçapı
                model.position.x = Math.cos(angle) * radius; // X ekseni
                model.position.z = Math.sin(angle) * radius; // Z ekseni

                // Modeli kendi ekseninde de döndür (opsiyonel)
                model.rotation.y += 0.005; // Y ekseninde döndür
            }

            // Sahneyi render et
            renderer.render(scene, camera);
        };

        animate();


        return () => {
            containerRef.current?.removeChild(renderer.domElement);
        };

    }, [])
    return <div ref={containerRef} />;
}

export default boxscene