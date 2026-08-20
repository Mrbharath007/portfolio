import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * FloatingHeroShapes: Ultra-smooth, responsive Three.js canvas that spans the Hero section,
 * rendering floating geometric 3D polyhedra (icosahedrons, tetrahedrons, octahedrons, torus rings)
 * that gently drift, rotate, and react to cursor parallax across multiple Z-depth layers.
 */
const FloatingHeroShapes = ({ mainColor = "#7b61ff" }) => {
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
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const primaryLight = new THREE.PointLight(new THREE.Color(mainColor), 2.5, 30);
    primaryLight.position.set(5, 5, 8);
    scene.add(primaryLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 2, 30);
    cyanLight.position.set(-6, -4, 6);
    scene.add(cyanLight);

    const disposables = [];
    const register = (geo, mat) => {
      if (geo) disposables.push(geo);
      if (mat) disposables.push(mat);
    };

    // --- Shaders / Materials ---
    const primaryMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(mainColor),
      emissive: new THREE.Color(mainColor),
      emissiveIntensity: 0.25,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    register(null, primaryMat);

    // Dynamic Color Updater for GPU materials & lights
    const updateColors = (newColorHex) => {
      try {
        const c = new THREE.Color(newColorHex || "#7b61ff");
        primaryLight.color.copy(c);
        primaryMat.color.copy(c);
        primaryMat.emissive.copy(c);
      } catch (err) {
        // Safe fallback
      }
    };
    colorUpdaterRef.current = updateColors;
    updateColors(mainColor);

    const cyanMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.3,
      metalness: 0.75,
      roughness: 0.2,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.8,
    });
    register(null, cyanMat);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    register(null, wireMat);

    // --- Floating Shapes Configuration with Multi-layer Depth ---
    const shapesData = [
      // Top-Left foreground
      {
        type: "octahedron",
        size: 0.85,
        pos: [-5.8, 3.2, 2.5],
        rotSpeed: [0.008, 0.012, 0.005],
        driftSpeed: 0.6,
        driftAmp: 0.35,
        parallaxFactor: 1.4, // foreground moves faster
        mat: primaryMat,
      },
      // Top-Right midground
      {
        type: "icosahedron",
        size: 0.95,
        pos: [6.2, 3.8, -1.0],
        rotSpeed: [0.006, 0.009, 0.007],
        driftSpeed: 0.5,
        driftAmp: 0.4,
        parallaxFactor: 0.9,
        mat: cyanMat,
      },
      // Bottom-Left deep background
      {
        type: "torus",
        radius: 1.1,
        tube: 0.18,
        pos: [-6.5, -3.5, -3.5],
        rotSpeed: [0.012, 0.005, 0.008],
        driftSpeed: 0.4,
        driftAmp: 0.25,
        parallaxFactor: 0.5, // background moves slower
        mat: primaryMat,
      },
      // Bottom-Right foreground
      {
        type: "tetrahedron",
        size: 1.0,
        pos: [5.6, -3.2, 3.0],
        rotSpeed: [0.009, 0.014, 0.006],
        driftSpeed: 0.7,
        driftAmp: 0.45,
        parallaxFactor: 1.6,
        mat: cyanMat,
      },
      // Mid-Center high
      {
        type: "dodecahedron",
        size: 0.65,
        pos: [-1.8, 4.2, -0.5],
        rotSpeed: [0.007, 0.01, 0.008],
        driftSpeed: 0.55,
        driftAmp: 0.3,
        parallaxFactor: 1.0,
        mat: primaryMat,
      },
      // Mid-Center bottom
      {
        type: "octahedron",
        size: 0.7,
        pos: [1.2, -4.0, 1.2],
        rotSpeed: [0.01, 0.008, 0.011],
        driftSpeed: 0.65,
        driftAmp: 0.35,
        parallaxFactor: 1.2,
        mat: cyanMat,
      },
      // Far right accent
      {
        type: "torus",
        radius: 0.75,
        tube: 0.12,
        pos: [7.8, 0.5, -2.0],
        rotSpeed: [0.008, 0.012, 0.004],
        driftSpeed: 0.45,
        driftAmp: 0.3,
        parallaxFactor: 0.7,
        mat: primaryMat,
      },
    ];

    const shapeMeshes = [];

    shapesData.forEach((data, index) => {
      const group = new THREE.Group();
      let geo;

      if (data.type === "octahedron") {
        geo = new THREE.OctahedronGeometry(data.size, 0);
      } else if (data.type === "icosahedron") {
        geo = new THREE.IcosahedronGeometry(data.size, 0);
      } else if (data.type === "tetrahedron") {
        geo = new THREE.TetrahedronGeometry(data.size, 0);
      } else if (data.type === "dodecahedron") {
        geo = new THREE.DodecahedronGeometry(data.size, 0);
      } else if (data.type === "torus") {
        geo = new THREE.TorusGeometry(data.radius, data.tube, 16, 48);
      }
      register(geo);

      const mesh = new THREE.Mesh(geo, data.mat);
      group.add(mesh);

      // Wireframe contour overlay
      const wireMesh = new THREE.Mesh(geo, wireMat);
      wireMesh.scale.set(1.05, 1.05, 1.05);
      group.add(wireMesh);

      group.position.set(...data.pos);
      scene.add(group);

      shapeMeshes.push({
        group,
        basePos: [...data.pos],
        rotSpeed: data.rotSpeed,
        driftSpeed: data.driftSpeed,
        driftAmp: data.driftAmp,
        parallaxFactor: data.parallaxFactor,
        phase: index * 1.35,
      });
    });

    // --- Interactive Mouse Tracking for Parallax ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX / rect.width - 0.5) * 2;
      mouse.targetY = -(clientY / rect.height - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // --- Resize Observer ---
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

      // Damped spring interpolation for smooth parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Animate each floating geometric object
      shapeMeshes.forEach((item) => {
        const { group, basePos, rotSpeed, driftSpeed, driftAmp, parallaxFactor, phase } = item;

        // Continuous slow rotation
        group.rotation.x += rotSpeed[0];
        group.rotation.y += rotSpeed[1];
        group.rotation.z += rotSpeed[2];

        // Harmonic floating drift
        const driftY = Math.sin(elapsed * driftSpeed + phase) * driftAmp;
        const driftX = Math.cos(elapsed * (driftSpeed * 0.7) + phase) * (driftAmp * 0.5);

        // Parallax mouse follow with depth weighting
        const targetPosX = basePos[0] + driftX + mouse.x * (1.2 * parallaxFactor);
        const targetPosY = basePos[1] + driftY + mouse.y * (1.2 * parallaxFactor);

        group.position.x += (targetPosX - group.position.x) * 0.08;
        group.position.y += (targetPosY - group.position.y) * 0.08;
      });

      // Move primary light subtly with mouse
      primaryLight.position.x = mouse.x * 3 + 5;
      primaryLight.position.y = mouse.y * 3 + 5;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      resizeObserver.disconnect();

      disposables.forEach((item) => {
        if (item && item.dispose) item.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="floating-hero-shapes-canvas"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
      aria-hidden="true"
    />
  );
};

export default FloatingHeroShapes;
