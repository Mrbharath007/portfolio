import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Hero3DCanvas = ({ mainColor = "#7b61ff" }) => {
  const mountRef = useRef(null);
  const colorUpdaterRef = useRef(null);

  // Dynamic Color Update without recreating WebGL context
  useEffect(() => {
    if (colorUpdaterRef.current) {
      colorUpdaterRef.current(mainColor);
    }
  }, [mainColor]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Clean up any stale canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Prevent permanent WebGL context loss on resource pressure
    renderer.domElement.addEventListener(
      "webglcontextlost",
      (e) => {
        e.preventDefault();
      },
      false
    );

    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(new THREE.Color(mainColor), 3, 20);
    pointLight.position.set(2, 2, 4);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0x00ffff, 2, 20);
    backLight.position.set(-3, -2, -3);
    scene.add(backLight);

    // --- 3D Objects Group ---
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Icosahedron (Core)
    const coreGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(mainColor),
      emissive: new THREE.Color(mainColor),
      emissiveIntensity: 0.25,
      metalness: 0.8,
      roughness: 0.15,
      transmission: 0.6,
      thickness: 1.2,
      wireframe: false,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // 2. Wireframe Overlay on Core
    const wireGeo = new THREE.IcosahedronGeometry(1.37, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    mainGroup.add(wireMesh);

    // 3. Orbiting Quantum Ring (Torus)
    const ringGeo = new THREE.TorusGeometry(2.1, 0.04, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(mainColor),
      emissive: new THREE.Color(mainColor),
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.9,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 3;
    mainGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.35, 0.03, 16, 100),
      new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        emissive: 0x00e5ff,
        emissiveIntensity: 0.6,
        roughness: 0.3,
      })
    );
    ringMesh2.rotation.y = Math.PI / 4;
    ringMesh2.rotation.x = -Math.PI / 5;
    mainGroup.add(ringMesh2);

    // 4. Floating 3D Micro Octahedrons
    const microCount = 12;
    const microMeshes = [];
    const microGeo = new THREE.OctahedronGeometry(0.12, 0);

    for (let i = 0; i < microCount; i++) {
      const mMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? new THREE.Color(mainColor) : 0x00f2fe,
        emissive: i % 2 === 0 ? new THREE.Color(mainColor) : 0x00f2fe,
        emissiveIntensity: 0.5,
        metalness: 0.7,
        roughness: 0.2,
      });
      const mMesh = new THREE.Mesh(microGeo, mMat);
      const angle = (i / microCount) * Math.PI * 2;
      const radius = 2.6 + Math.sin(i * 1.5) * 0.4;
      mMesh.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 2) * 0.8,
        Math.sin(angle) * radius
      );
      mMesh.userData = {
        angle,
        speed: 0.015 + (i % 3) * 0.005,
        radius,
        rotSpeedX: 0.02 * (i % 2 === 0 ? 1 : -1),
        rotSpeedY: 0.03,
      };
      mainGroup.add(mMesh);
      microMeshes.push(mMesh);
    }

    // Dynamic Color Updater for GPU materials
    const updateColors = (newColorHex) => {
      try {
        const c = new THREE.Color(newColorHex || "#7b61ff");
        pointLight.color.copy(c);
        coreMat.color.copy(c);
        coreMat.emissive.copy(c);
        ringMat.color.copy(c);
        ringMat.emissive.copy(c);
        microMeshes.forEach((mesh, idx) => {
          if (idx % 2 === 0 && mesh.material) {
            mesh.material.color.copy(c);
            mesh.material.emissive.copy(c);
          }
        });
      } catch (err) {
        // Safe fallback
      }
    };
    colorUpdaterRef.current = updateColors;
    updateColors(mainColor);

    // 5. Starfield / Particle Cloud
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
      particleScales[i / 3] = Math.random() * 2 + 1;
    }

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- Interactive Mouse Physics ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isHovered = false;
    let targetScale = 1;
    let currentScale = 1;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.targetX = x * 2;
      mouse.targetY = -y * 2;
    };

    const handleMouseEnter = () => {
      isHovered = true;
      targetScale = 1.08;
    };

    const handleMouseLeave = () => {
      isHovered = false;
      mouse.targetX = 0;
      mouse.targetY = 0;
      targetScale = 1;
    };

    const handleClick = () => {
      // Impulse ripple on click
      targetScale = 1.22;
      setTimeout(() => {
        targetScale = isHovered ? 1.08 : 1;
      }, 250);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("click", handleClick);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // --- Animation Loop ---
    let animFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation (Damping)
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      currentScale += (targetScale - currentScale) * 0.1;
      mainGroup.scale.set(currentScale, currentScale, currentScale);

      // Core rotation & tilt responding to mouse
      mainGroup.rotation.y = elapsedTime * 0.4 + mouse.x * 1.2;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2 + mouse.y * 0.9;
      mainGroup.position.x = mouse.x * 0.4;
      mainGroup.position.y = mouse.y * 0.4;

      // Rotate individual components
      coreMesh.rotation.y += 0.008;
      coreMesh.rotation.x += 0.005;
      wireMesh.rotation.y -= 0.006;
      wireMesh.rotation.z += 0.004;

      ringMesh1.rotation.z += 0.012;
      ringMesh2.rotation.z -= 0.015;

      // Move point light with mouse
      pointLight.position.x = mouse.x * 4 + 2;
      pointLight.position.y = mouse.y * 4 + 2;

      // Animate floating micro octahedrons
      microMeshes.forEach((mesh) => {
        mesh.userData.angle += mesh.userData.speed;
        mesh.position.x = Math.cos(mesh.userData.angle) * mesh.userData.radius;
        mesh.position.z = Math.sin(mesh.userData.angle) * mesh.userData.radius;
        mesh.position.y =
          Math.sin(mesh.userData.angle * 2 + elapsedTime) * 0.9;
        mesh.rotation.x += mesh.userData.rotSpeedX;
        mesh.rotation.y += mesh.userData.rotSpeedY;
      });

      // Slowly rotate background particle cloud
      particleSystem.rotation.y = elapsedTime * 0.03;
      particleSystem.rotation.x = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("click", handleClick);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      resizeObserver.disconnect();

      // Dispose geometries and materials
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      microGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="hero-3d-canvas-container"
      title="Click or move cursor to interact with 3D Core"
    />
  );
};

export default Hero3DCanvas;
