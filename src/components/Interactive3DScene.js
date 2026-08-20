import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Interactive3DScene: High-performance, responsive 3D WebGL scenes with mouse tracking,
 * spring physics, specular highlights, and color synchronization.
 *
 * Supported modes:
 * - 'tech-crystal' (About Me)
 * - 'quantum-gyro' (Domains / Area of Interest)
 * - 'dodecahedron' (Skills)
 * - 'portal-knot' (Projects)
 * - 'chrono-helix' (Timeline)
 * - 'beacon-satellite' (Contact)
 */
const Interactive3DScene = ({
  mode = "portal-knot",
  mainColor = "#7b61ff",
  height = "240px",
  className = "",
  interactive = true,
}) => {
  const mountRef = useRef(null);
  const colorUpdaterRef = useRef(null);

  // Dynamic color updating whenever mainColor changes
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
    const width = container.clientWidth || 300;
    const heightPx = container.clientHeight || 240;

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Prevent permanent WebGL context loss
    renderer.domElement.addEventListener(
      "webglcontextlost",
      (e) => {
        e.preventDefault();
      },
      false
    );

    container.appendChild(renderer.domElement);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(new THREE.Color(mainColor), 3, 16);
    pointLight1.position.set(3, 3, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00f2fe, 2, 16);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);

    // --- Main Group ---
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const disposables = [];
    const register = (geo, mat) => {
      if (geo) disposables.push(geo);
      if (mat) disposables.push(mat);
    };

    // Shared base materials
    const mainMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(mainColor),
      emissive: new THREE.Color(mainColor),
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.9,
    });
    register(null, mainMat);

    // Dynamic Color Updater for GPU materials & lights
    const updateColors = (newColorHex) => {
      try {
        const c = new THREE.Color(newColorHex || "#7b61ff");
        pointLight1.color.copy(c);
        mainMat.color.copy(c);
        mainMat.emissive.copy(c);
      } catch (err) {
        // Safe fallback
      }
    };
    colorUpdaterRef.current = updateColors;
    updateColors(mainColor);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    register(null, wireMat);

    const glowMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.9,
    });
    register(null, glowMat);

    let extraAnimatedObjects = [];

    if (mode === "portal-knot") {
      // 1. Hyper Torus Knot (Projects)
      const knotGeo = new THREE.TorusKnotGeometry(0.95, 0.28, 128, 20, 2, 3);
      register(knotGeo);
      const knotMesh = new THREE.Mesh(knotGeo, mainMat);
      mainGroup.add(knotMesh);

      const knotWireMesh = new THREE.Mesh(knotGeo, wireMat);
      knotWireMesh.scale.set(1.02, 1.02, 1.02);
      mainGroup.add(knotWireMesh);

      const ringGeo = new THREE.TorusGeometry(1.8, 0.03, 16, 80);
      register(ringGeo);
      const ring = new THREE.Mesh(ringGeo, glowMat);
      ring.rotation.x = Math.PI / 3;
      mainGroup.add(ring);
      extraAnimatedObjects.push({ obj: ring, rotZ: 0.02 });

    } else if (mode === "tech-crystal") {
      // 2. Cyber Crystal / Octahedron with floating energy nodes (About Me)
      const crystalGeo = new THREE.OctahedronGeometry(1.15, 0);
      register(crystalGeo);
      const crystalMesh = new THREE.Mesh(crystalGeo, mainMat);
      mainGroup.add(crystalMesh);

      const crystalWire = new THREE.Mesh(crystalGeo, wireMat);
      crystalWire.scale.set(1.06, 1.06, 1.06);
      mainGroup.add(crystalWire);

      for (let i = 0; i < 6; i++) {
        const miniGeo = new THREE.IcosahedronGeometry(0.12, 0);
        register(miniGeo);
        const miniMesh = new THREE.Mesh(miniGeo, glowMat);
        const angle = (i / 6) * Math.PI * 2;
        miniMesh.position.set(Math.cos(angle) * 1.8, Math.sin(angle) * 0.6, Math.sin(angle) * 1.8);
        mainGroup.add(miniMesh);
        extraAnimatedObjects.push({
          obj: miniMesh,
          orbit: true,
          angle,
          speed: 0.02 + i * 0.003,
          radius: 1.8,
        });
      }

    } else if (mode === "quantum-gyro") {
      // 3. Multi-axis Quantum Gyroscope (Domains / Area of Interest)
      const coreGeo = new THREE.SphereGeometry(0.55, 32, 32);
      register(coreGeo);
      const coreMesh = new THREE.Mesh(coreGeo, mainMat);
      mainGroup.add(coreMesh);

      const ring1Geo = new THREE.TorusGeometry(1.1, 0.04, 16, 64);
      const ring2Geo = new THREE.TorusGeometry(1.4, 0.04, 16, 64);
      const ring3Geo = new THREE.TorusGeometry(1.7, 0.04, 16, 64);
      register(ring1Geo);
      register(ring2Geo);
      register(ring3Geo);

      const ring1 = new THREE.Mesh(ring1Geo, glowMat);
      const ring2 = new THREE.Mesh(ring2Geo, mainMat);
      const ring3 = new THREE.Mesh(ring3Geo, glowMat);

      mainGroup.add(ring1);
      mainGroup.add(ring2);
      mainGroup.add(ring3);

      extraAnimatedObjects.push({ obj: ring1, rotX: 0.025, rotY: 0.015 });
      extraAnimatedObjects.push({ obj: ring2, rotY: -0.02, rotZ: 0.018 });
      extraAnimatedObjects.push({ obj: ring3, rotZ: 0.022, rotX: -0.012 });

    } else if (mode === "chrono-helix") {
      // 4. DNA Chrono Helix / Stepped Time Nodes (Timeline)
      const helixCount = 14;
      const helixGroup = new THREE.Group();
      mainGroup.add(helixGroup);

      for (let i = 0; i < helixCount; i++) {
        const t = (i / helixCount) * Math.PI * 4;
        const y = ((i - helixCount / 2) / helixCount) * 2.8;
        const x1 = Math.cos(t) * 1.1;
        const z1 = Math.sin(t) * 1.1;
        const x2 = Math.cos(t + Math.PI) * 1.1;
        const z2 = Math.sin(t + Math.PI) * 1.1;

        const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
        register(sphereGeo);

        const node1 = new THREE.Mesh(sphereGeo, i % 2 === 0 ? mainMat : glowMat);
        node1.position.set(x1, y, z1);
        helixGroup.add(node1);

        const node2 = new THREE.Mesh(sphereGeo, i % 2 === 0 ? glowMat : mainMat);
        node2.position.set(x2, y, z2);
        helixGroup.add(node2);

        const barGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.2, 8);
        register(barGeo);
        const bar = new THREE.Mesh(barGeo, wireMat);
        bar.position.set(0, y, 0);
        bar.rotation.z = Math.PI / 2;
        bar.rotation.y = -t;
        helixGroup.add(bar);
      }

      extraAnimatedObjects.push({ obj: helixGroup, rotY: 0.015 });

    } else if (mode === "beacon-satellite") {
      // 5. Communication Polyhedron & Pulsing Signal Beacon (Contact)
      const icoGeo = new THREE.IcosahedronGeometry(0.9, 0);
      register(icoGeo);
      const icoMesh = new THREE.Mesh(icoGeo, mainMat);
      mainGroup.add(icoMesh);

      const icoWire = new THREE.Mesh(icoGeo, wireMat);
      icoWire.scale.set(1.05, 1.05, 1.05);
      mainGroup.add(icoWire);

      const pulseGeo1 = new THREE.TorusGeometry(1.5, 0.025, 16, 64);
      const pulseGeo2 = new THREE.TorusGeometry(1.9, 0.02, 16, 64);
      register(pulseGeo1);
      register(pulseGeo2);

      const pulseRing1 = new THREE.Mesh(pulseGeo1, glowMat);
      const pulseRing2 = new THREE.Mesh(pulseGeo2, glowMat);
      pulseRing1.rotation.x = Math.PI / 2;
      pulseRing2.rotation.x = Math.PI / 2;
      mainGroup.add(pulseRing1);
      mainGroup.add(pulseRing2);

      extraAnimatedObjects.push({ obj: pulseRing1, rotZ: 0.015, pulse: true, speed: 2 });
      extraAnimatedObjects.push({ obj: pulseRing2, rotZ: -0.018, pulse: true, speed: 1.5 });

    } else {
      // 6. Default Dodecahedron (Skills)
      const dGeo = new THREE.DodecahedronGeometry(1.1, 0);
      register(dGeo);
      const dMesh = new THREE.Mesh(dGeo, mainMat);
      mainGroup.add(dMesh);

      const dWire = new THREE.Mesh(dGeo, wireMat);
      dWire.scale.set(1.04, 1.04, 1.04);
      mainGroup.add(dWire);

      const orbitGeo = new THREE.TorusGeometry(1.7, 0.025, 16, 64);
      register(orbitGeo);
      const orbitRing = new THREE.Mesh(orbitGeo, glowMat);
      orbitRing.rotation.x = Math.PI / 3.5;
      mainGroup.add(orbitRing);
      extraAnimatedObjects.push({ obj: orbitRing, rotZ: 0.02 });
    }

    // --- Interactive Mouse Physics ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isHovered = false;
    let targetScale = 1;
    let currentScale = 1;

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.targetX = x * 2.2;
      mouse.targetY = -y * 2.2;
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
      targetScale = 1.22;
      mainGroup.rotation.y += Math.PI * 0.4;
      setTimeout(() => {
        targetScale = isHovered ? 1.08 : 1;
      }, 300);
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("click", handleClick);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // --- Animation Loop ---
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Damped spring mouse physics
      mouse.x += (mouse.targetX - mouse.x) * 0.07;
      mouse.y += (mouse.targetY - mouse.y) * 0.07;

      currentScale += (targetScale - currentScale) * 0.1;
      mainGroup.scale.set(currentScale, currentScale, currentScale);

      // Natural continuous rotation + harmonic 3D floating levitation + mouse tilt
      mainGroup.rotation.x = elapsed * 0.28 + mouse.y * 1.1;
      mainGroup.rotation.y = elapsed * 0.45 + mouse.x * 1.3;
      mainGroup.rotation.z = Math.sin(elapsed * 0.7) * 0.12;
      mainGroup.position.x = Math.sin(elapsed * 0.85) * 0.15 + mouse.x * 0.35;
      mainGroup.position.y = Math.sin(elapsed * 1.4) * 0.22 + Math.cos(elapsed * 0.7) * 0.08 + mouse.y * 0.35;

      extraAnimatedObjects.forEach((item) => {
        if (item.rotX) item.obj.rotation.x += item.rotX;
        if (item.rotY) item.obj.rotation.y += item.rotY;
        if (item.rotZ) item.obj.rotation.z += item.rotZ;

        if (item.orbit) {
          item.angle += item.speed;
          item.obj.position.x = Math.cos(item.angle) * item.radius;
          item.obj.position.z = Math.sin(item.angle) * item.radius;
          item.obj.position.y = Math.sin(item.angle * 2 + elapsed) * 0.4;
        }

        if (item.pulse) {
          const s = 1 + Math.sin(elapsed * item.speed) * 0.08;
          item.obj.scale.set(s, s, s);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animId);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("click", handleClick);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      resizeObserver.disconnect();

      disposables.forEach((item) => {
        if (item && item.dispose) item.dispose();
      });
      renderer.dispose();
    };
  }, [mode, interactive]);

  return (
    <div
      ref={mountRef}
      className={`interactive-3d-scene ${className}`}
      style={{
        width: "100%",
        height: height,
        position: "relative",
        cursor: "grab",
      }}
      title="Interact with 3D Object (Move cursor / Click)"
    />
  );
};

export default Interactive3DScene;
