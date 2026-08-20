import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Global3DBackground: Advanced Space Galaxy Parallax Engine
 * - Custom GLSL ShaderMaterial for organic twinkling & breathing starlight
 * - Real-time GPU color synchronization when user changes theme color
 * - Always active & luminous across all sections
 * - Interactive mouse gravity well & parallax depth
 * - Non-blocking (pointer-events: none, z-index: 0)
 */
const Global3DBackground = ({ mainColor = "#7b61ff" }) => {
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
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.set(0, 16, 36);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // Prevent permanent WebGL context loss
    renderer.domElement.addEventListener(
      "webglcontextlost",
      (e) => {
        e.preventDefault();
      },
      false
    );

    container.appendChild(renderer.domElement);

    const disposables = [];
    const register = (geo, mat) => {
      if (geo) disposables.push(geo);
      if (mat) disposables.push(mat);
    };

    // --- Custom GLSL Particle Shaders for Organic Twinkling & Pulsing ---
    const vertexShader = `
      uniform float uTime;
      uniform float uSize;
      uniform float uPixelRatio;

      attribute float aScale;
      attribute float aRandomness;
      attribute vec3 aRandomPhase;

      varying vec3 vColor;
      varying float vTwinkle;

      void main() {
        vColor = color;

        // Multi-harmonic organic twinkling & pulsing calculation
        float slowPulse = sin(uTime * aRandomPhase.x + aRandomPhase.y) * 0.4 + 0.6;
        float fastShimmer = sin(uTime * (aRandomPhase.x * 2.8) + aRandomPhase.z) * 0.3 + 0.7;
        float twinkle = mix(slowPulse, fastShimmer, aRandomness);
        vTwinkle = twinkle;

        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;

        gl_Position = projectedPosition;

        // Scale particle size with organic twinkle pulsation and perspective depth attenuation
        gl_PointSize = uSize * aScale * (0.65 + twinkle * 0.75) * (300.0 / -viewPosition.z) * uPixelRatio;
        gl_PointSize = clamp(gl_PointSize, 1.5, 75.0);
      }
    `;

    const fragmentShader = `
      uniform float uOpacity;

      varying vec3 vColor;
      varying float vTwinkle;

      void main() {
        // High-precision circular Gaussian starlight falloff
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        // Exponential soft core brightness with smooth halo
        float strength = pow(1.0 - (dist * 2.0), 1.75);

        // Modulate color intensity and alpha with organic twinkle
        float alpha = strength * uOpacity * (0.6 + vTwinkle * 0.5);
        vec3 finalColor = vColor * (0.85 + vTwinkle * 0.4);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    // --- 1. Spiral Galaxy Setup ---
    const galaxyParams = {
      count: 7500,
      size: 0.28,
      radius: 44,
      branches: 4,
      spin: 1.25,
      randomness: 0.48,
      power: 3.0,
      insideColor: "#ffffff",
      outsideColor: "#00f2fe",
    };

    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyPositions = new Float32Array(galaxyParams.count * 3);
    const originalPositions = new Float32Array(galaxyParams.count * 3);
    const galaxyColors = new Float32Array(galaxyParams.count * 3);
    const galaxyScales = new Float32Array(galaxyParams.count);
    const galaxyRandomness = new Float32Array(galaxyParams.count);
    const galaxyRandomPhase = new Float32Array(galaxyParams.count * 3);
    const galaxyRadii = new Float32Array(galaxyParams.count);

    for (let i = 0; i < galaxyParams.count; i++) {
      const i3 = i * 3;

      // Distance from center with dense core distribution
      const radius = Math.pow(Math.random(), galaxyParams.power) * galaxyParams.radius;
      galaxyRadii[i] = radius;
      const spinAngle = radius * galaxyParams.spin;
      const branchAngle = ((i % galaxyParams.branches) / galaxyParams.branches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius;
      const randomY =
        Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * (radius * 0.38);
      const randomZ =
        Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius;

      const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
      const y = randomY;
      const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      galaxyPositions[i3] = x;
      galaxyPositions[i3 + 1] = y;
      galaxyPositions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      galaxyScales[i] = Math.random() * 1.6 + 0.6;
      galaxyRandomness[i] = Math.random();

      // Randomized twinkling frequencies (1.5 - 4.5 rad/s) and arbitrary initial phases
      galaxyRandomPhase[i3] = Math.random() * 3.0 + 1.5; // Frequency
      galaxyRandomPhase[i3 + 1] = Math.random() * Math.PI * 2; // Phase 1
      galaxyRandomPhase[i3 + 2] = Math.random() * Math.PI * 2; // Phase 2
    }

    galaxyGeo.setAttribute("position", new THREE.BufferAttribute(galaxyPositions, 3));
    galaxyGeo.setAttribute("color", new THREE.BufferAttribute(galaxyColors, 3));
    galaxyGeo.setAttribute("aScale", new THREE.BufferAttribute(galaxyScales, 1));
    galaxyGeo.setAttribute("aRandomness", new THREE.BufferAttribute(galaxyRandomness, 1));
    galaxyGeo.setAttribute("aRandomPhase", new THREE.BufferAttribute(galaxyRandomPhase, 3));
    register(galaxyGeo);

    const galaxyShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: galaxyParams.size },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uOpacity: { value: 0.95 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    register(null, galaxyShaderMaterial);

    const galaxyGroup = new THREE.Group();
    const galaxyPoints = new THREE.Points(galaxyGeo, galaxyShaderMaterial);
    galaxyGroup.add(galaxyPoints);
    scene.add(galaxyGroup);

    // --- 2. Deep Outer Cosmos Starfield with Twinkle Shader ---
    const cosmosCount = 1500;
    const cosmosGeo = new THREE.BufferGeometry();
    const cosmosPos = new Float32Array(cosmosCount * 3);
    const cosmosCol = new Float32Array(cosmosCount * 3);
    const cosmosScales = new Float32Array(cosmosCount);
    const cosmosRandomness = new Float32Array(cosmosCount);
    const cosmosRandomPhase = new Float32Array(cosmosCount * 3);

    for (let i = 0; i < cosmosCount; i++) {
      const idx = i * 3;
      cosmosPos[idx] = (Math.random() - 0.5) * 180;
      cosmosPos[idx + 1] = (Math.random() - 0.5) * 160;
      cosmosPos[idx + 2] = (Math.random() - 0.5) * 140 - 25;

      cosmosScales[i] = Math.random() * 1.8 + 0.5;
      cosmosRandomness[i] = Math.random();
      cosmosRandomPhase[idx] = Math.random() * 2.2 + 0.8;
      cosmosRandomPhase[idx + 1] = Math.random() * Math.PI * 2;
      cosmosRandomPhase[idx + 2] = Math.random() * Math.PI * 2;
    }

    cosmosGeo.setAttribute("position", new THREE.BufferAttribute(cosmosPos, 3));
    cosmosGeo.setAttribute("color", new THREE.BufferAttribute(cosmosCol, 3));
    cosmosGeo.setAttribute("aScale", new THREE.BufferAttribute(cosmosScales, 1));
    cosmosGeo.setAttribute("aRandomness", new THREE.BufferAttribute(cosmosRandomness, 1));
    cosmosGeo.setAttribute("aRandomPhase", new THREE.BufferAttribute(cosmosRandomPhase, 3));
    register(cosmosGeo);

    const cosmosShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 0.4 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uOpacity: { value: 0.85 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    register(null, cosmosShaderMaterial);

    const cosmosPoints = new THREE.Points(cosmosGeo, cosmosShaderMaterial);
    scene.add(cosmosPoints);

    // --- Color Update Helper Function ---
    const updateColors = (newColorHex) => {
      const colorInside = new THREE.Color(galaxyParams.insideColor);
      const colorMid = new THREE.Color(newColorHex || "#7b61ff");
      const colorOutside = new THREE.Color(galaxyParams.outsideColor);

      // Update Galaxy particle colors
      const gColors = galaxyGeo.attributes.color.array;
      for (let i = 0; i < galaxyParams.count; i++) {
        const i3 = i * 3;
        const radius = galaxyRadii[i];
        const mixedColor = colorInside.clone();
        const ratio = radius / galaxyParams.radius;
        if (ratio < 0.3) {
          mixedColor.lerp(colorMid, ratio / 0.3);
        } else {
          mixedColor.copy(colorMid).lerp(colorOutside, (ratio - 0.3) / 0.7);
        }
        gColors[i3] = mixedColor.r;
        gColors[i3 + 1] = mixedColor.g;
        gColors[i3 + 2] = mixedColor.b;
      }
      galaxyGeo.attributes.color.needsUpdate = true;

      // Update Cosmos starfield colors
      const cColors = cosmosGeo.attributes.color.array;
      for (let i = 0; i < cosmosCount; i++) {
        const idx = i * 3;
        const rColor = (i % 10) / 10;
        const c = rColor < 0.4 ? colorMid : rColor < 0.7 ? colorOutside : colorInside;
        cColors[idx] = c.r;
        cColors[idx + 1] = c.g;
        cColors[idx + 2] = c.b;
      }
      cosmosGeo.attributes.color.needsUpdate = true;
    };

    colorUpdaterRef.current = updateColors;
    updateColors(mainColor);

    // --- 3. Shooting Stars / Comets ---
    const meteorCount = 6;
    const meteors = [];
    const meteorGeo = new THREE.BufferGeometry();

    for (let i = 0; i < meteorCount; i++) {
      meteors.push({
        x: (Math.random() - 0.5) * 80,
        y: Math.random() * 40 + 10,
        z: (Math.random() - 0.5) * 40,
        length: Math.random() * 4 + 3,
        speed: Math.random() * 0.4 + 0.3,
        active: Math.random() > 0.4,
        respawnTimer: Math.random() * 300,
      });
    }

    const meteorMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    register(meteorGeo, meteorMat);

    const meteorLines = new THREE.LineSegments(meteorGeo, meteorMat);
    scene.add(meteorLines);

    // --- 4. Interactive Supernova Shockwaves ---
    const shockwaves = [];
    const triggerSupernova = (x, y) => {
      shockwaves.push({
        x: x || 0,
        y: y || 0,
        radius: 0.5,
        maxRadius: 30,
        speed: 0.65,
        strength: 3.8,
        opacity: 1.0,
      });
    };

    // --- Mouse & Scroll Tracking ---
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      worldX: 0,
      worldY: 0,
    };
    let scrollProgress = 0;
    let targetScrollProgress = 0;

    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
      mouse.worldX = mouse.targetX * 25;
      mouse.worldY = mouse.targetY * 15;
    };

    const handleClick = () => {
      triggerSupernova(mouse.worldX, mouse.worldY);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    handleScroll();

    // --- Resize Observer ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      const pr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(pr);
      galaxyShaderMaterial.uniforms.uPixelRatio.value = pr;
      cosmosShaderMaterial.uniforms.uPixelRatio.value = pr;
    };
    window.addEventListener("resize", handleResize);

    // --- Animation Loop ---
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Update shader uniform times for continuous organic twinkling
      galaxyShaderMaterial.uniforms.uTime.value = elapsed;
      cosmosShaderMaterial.uniforms.uTime.value = elapsed;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Smooth scroll lerp
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.07;

      // Galaxy Spiral Continuous Rotation with 3D Pitch/Tilt
      galaxyGroup.rotation.y = elapsed * 0.05 + scrollProgress * Math.PI * 1.5;
      galaxyGroup.rotation.x = Math.PI * 0.22 + mouse.y * 0.35;
      galaxyGroup.rotation.z = Math.sin(elapsed * 0.08) * 0.1 + mouse.x * 0.25;

      // Parallax Camera Motion
      camera.position.x = mouse.x * 6;
      camera.position.y = 16 - scrollProgress * 12 + mouse.y * 5;
      camera.position.z = 36 - scrollProgress * 10;
      camera.lookAt(0, -scrollProgress * 6, 0);

      // Deep cosmos counter-drift
      cosmosPoints.rotation.y = -elapsed * 0.012;
      cosmosPoints.rotation.x = elapsed * 0.007;

      // Supernova Shockwave expansion & particle displacement
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += sw.speed;
        sw.opacity = Math.max(0, 1 - sw.radius / sw.maxRadius);

        if (sw.radius >= sw.maxRadius) {
          shockwaves.splice(s, 1);
        }
      }

      // Gravitational Vortex attraction to mouse cursor
      const hasShockwaves = shockwaves.length > 0;
      const vortexX = mouse.worldX;
      const vortexZ = -mouse.worldY * 1.5;
      const positions = galaxyGeo.attributes.position.array;

      for (let i = 0; i < galaxyParams.count; i++) {
        const i3 = i * 3;
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];

        let targetX = origX;
        let targetY = origY;
        let targetZ = origZ;

        // Mouse gravity pull
        const dx = origX - vortexX;
        const dz = origZ - vortexZ;
        const distSq = dx * dx + dz * dz;

        if (distSq < 140 && distSq > 1) {
          const force = (1 - Math.sqrt(distSq) / 12) * 2.2;
          targetX += (vortexX - origX) * force * 0.12;
          targetZ += (vortexZ - origZ) * force * 0.12;
          targetY += Math.sin(elapsed * 2 + i) * force * 0.5;
        }

        // Supernova pulse shockwave repulsion
        if (hasShockwaves) {
          for (let s = 0; s < shockwaves.length; s++) {
            const sw = shockwaves[s];
            const distFromShock = Math.sqrt(
              (origX - sw.x) * (origX - sw.x) + (origZ - sw.y) * (origZ - sw.y)
            );
            const delta = Math.abs(distFromShock - sw.radius);
            if (delta < 3.5) {
              const repulse = (1 - delta / 3.5) * sw.strength * sw.opacity;
              const angle = Math.atan2(origZ - sw.y, origX - sw.x);
              targetX += Math.cos(angle) * repulse;
              targetZ += Math.sin(angle) * repulse;
              targetY += (Math.random() - 0.5) * repulse * 1.5;
            }
          }
        }

        // Lerp particle back to orbit
        positions[i3] += (targetX - positions[i3]) * 0.08;
        positions[i3 + 1] += (targetY - positions[i3 + 1]) * 0.08;
        positions[i3 + 2] += (targetZ - positions[i3 + 2]) * 0.08;
      }
      galaxyGeo.attributes.position.needsUpdate = true;

      // Animate Shooting Stars / Meteors
      const meteorPosArray = new Float32Array(meteorCount * 6);
      meteors.forEach((m, idx) => {
        if (!m.active) {
          m.respawnTimer -= 1;
          if (m.respawnTimer <= 0) {
            m.active = true;
            m.x = (Math.random() - 0.5) * 90;
            m.y = Math.random() * 30 + 15;
            m.z = (Math.random() - 0.5) * 50;
            m.speed = Math.random() * 0.7 + 0.4;
            m.respawnTimer = Math.random() * 250 + 100;
          }
        } else {
          m.x -= m.speed * 1.6;
          m.y -= m.speed * 0.9;
          m.z -= m.speed * 0.5;

          const pIdx = idx * 6;
          // Head
          meteorPosArray[pIdx] = m.x;
          meteorPosArray[pIdx + 1] = m.y;
          meteorPosArray[pIdx + 2] = m.z;
          // Tail
          meteorPosArray[pIdx + 3] = m.x + m.length * 1.2;
          meteorPosArray[pIdx + 4] = m.y + m.length * 0.7;
          meteorPosArray[pIdx + 5] = m.z + m.length * 0.4;

          if (m.y < -30 || m.x < -60) {
            m.active = false;
          }
        }
      });
      meteorGeo.setAttribute("position", new THREE.BufferAttribute(meteorPosArray, 3));

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      disposables.forEach((d) => d && d.dispose && d.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="space-galaxy-parallax-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#000000",
      }}
      aria-hidden="true"
    />
  );
};

export default Global3DBackground;
