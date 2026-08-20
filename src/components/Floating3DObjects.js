import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Floating3DObjects = ({ mainColor = "#7b61ff", height = "320px", mode = "skills" }) => {
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
    const heightPx = container.clientHeight || 300;

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Prevent permanent WebGL context loss
    renderer.domElement.addEventListener(
      "webglcontextlost",
      (e) => {
        e.preventDefault();
      },
      false
    );

    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(new THREE.Color(mainColor), 2.5, 15);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const group = new THREE.Group();
    scene.add(group);

    // Shape selection depending on mode
    let mainGeometry;
    if (mode === "torus") {
      mainGeometry = new THREE.TorusKnotGeometry(1.0, 0.32, 100, 16);
    } else if (mode === "dodecahedron") {
      mainGeometry = new THREE.DodecahedronGeometry(1.2, 0);
    } else {
      mainGeometry = new THREE.OctahedronGeometry(1.3, 0);
    }

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(mainColor),
      emissive: new THREE.Color(mainColor),
      emissiveIntensity: 0.3,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });

    // Dynamic Color Updater for GPU materials & lights
    const updateColors = (newColorHex) => {
      try {
        const c = new THREE.Color(newColorHex || "#7b61ff");
        pointLight.color.copy(c);
        material.color.copy(c);
        material.emissive.copy(c);
      } catch (err) {
        // Safe fallback
      }
    };
    colorUpdaterRef.current = updateColors;
    updateColors(mainColor);

    const mainMesh = new THREE.Mesh(mainGeometry, material);
    group.add(mainMesh);

    // Wireframe halo
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh = new THREE.Mesh(mainGeometry, wireframeMat);
    wireMesh.scale.set(1.03, 1.03, 1.03);
    group.add(wireMesh);

    // Small orbiting satellite rings
    const ringGeo = new THREE.TorusGeometry(1.7, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.6,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    group.add(ring);

    // --- Interactive Mouse Physics ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isHovered = false;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.targetX = x * 2.5;
      mouse.targetY = -y * 2.5;
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    const handleClick = () => {
      // Rapid spin burst on click
      mainMesh.rotation.y += Math.PI * 0.7;
      mainMesh.rotation.x += Math.PI * 0.5;
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("click", handleClick);

    // Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      group.rotation.x = elapsed * 0.35 + mouse.y * 1.2;
      group.rotation.y = elapsed * 0.5 + mouse.x * 1.5;
      group.position.x = mouse.x * 0.3;
      group.position.y = Math.sin(elapsed * 1.5) * 0.12 + mouse.y * 0.3;

      ring.rotation.z += 0.02;

      renderer.render(scene, camera);
    };

    animate();

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
      mainGeometry.dispose();
      material.dispose();
      wireframeMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [mode]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: height,
        position: "relative",
        cursor: "grab",
      }}
      className="interactive-3d-object"
    />
  );
};

export default Floating3DObjects;
