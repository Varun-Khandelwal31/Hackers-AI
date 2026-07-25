'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Particle Geometry
    const particlesCount = 350;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const brandColor = new THREE.Color('#6366f1'); // Indigo
    const cyanColor = new THREE.Color('#06b6d4');  // Cyan
    const purpleColor = new THREE.Color('#a855f7'); // Purple

    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = (Math.random() - 0.5) * 80;
      positions[i + 2] = (Math.random() - 0.5) * 80;

      const mixColor = Math.random() > 0.5 ? brandColor : (Math.random() > 0.5 ? cyanColor : purpleColor);
      colors[i] = mixColor.r;
      colors[i + 1] = mixColor.g;
      colors[i + 2] = mixColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // 3D Geometric Icosahedron Nodes (Cyber Core)
    const nodeGeometry = new THREE.IcosahedronGeometry(4, 1);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const cyberCore = new THREE.Mesh(nodeGeometry, nodeMaterial);
    cyberCore.position.set(-15, 5, -10);
    scene.add(cyberCore);

    const secondaryCoreGeo = new THREE.TorusGeometry(6, 1.2, 16, 100);
    const secondaryCoreMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const secondaryCore = new THREE.Mesh(secondaryCoreGeo, secondaryCoreMat);
    secondaryCore.position.set(15, -8, -5);
    scene.add(secondaryCore);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = elapsedTime * 0.02;

      cyberCore.rotation.x = elapsedTime * 0.2;
      cyberCore.rotation.y = elapsedTime * 0.3;

      secondaryCore.rotation.x = elapsedTime * -0.15;
      secondaryCore.rotation.y = elapsedTime * 0.25;

      // Smooth camera parallax
      camera.position.x += (mouseX * 4 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 4 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden" />;
}
