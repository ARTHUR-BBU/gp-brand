"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// 顶点着色器 — 传递法线、位置、UV
const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// 片段着色器 — 奢侈品级珍珠渲染
const fragmentShader = /* glsl */ `
  uniform vec3 uBaseColor;
  uniform vec3 uSubsurfaceColor;
  uniform vec3 uSpecularColor;
  uniform vec3 uIridescentColor1;
  uniform vec3 uIridescentColor2;
  uniform vec3 uLightPos;
  uniform vec3 uLightPos2;
  uniform vec3 uCameraPos;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  // 薄膜干涉 — 模拟珠层折射产生的虹彩
  vec3 thinFilmInterference(float cosTheta, float thickness) {
    float delta = thickness * cosTheta;
    // 多层干涉色
    vec3 c1 = uIridescentColor1 * (0.5 + 0.5 * cos(delta * 2.0));
    vec3 c2 = uIridescentColor2 * (0.5 + 0.5 * cos(delta * 1.3 + 1.0));
    vec3 c3 = vec3(0.9, 0.85, 0.95) * (0.5 + 0.5 * cos(delta * 0.8 + 2.0));
    return mix(c1, c2, 0.5) + c3 * 0.15;
  }

  // 次表面散射近似
  float subsurfaceScattering(vec3 N, vec3 V, vec3 L) {
    vec3 sssN = normalize(N + L * 0.3);
    float sss = pow(max(0.0, dot(V, -sssN)), 2.5) * 0.6;
    // 背光透射
    float transmission = pow(max(0.0, dot(-L, V)), 3.0) * 0.25;
    return sss + transmission;
  }

  // 丝绸光泽 — 珍珠特有的定向光泽带
  float silkSheen(vec3 N, vec3 V, vec3 L) {
    vec3 H = normalize(L + V);
    float NdotH = max(0.0, dot(N, H));
    // 多层光泽
    float sheen1 = pow(NdotH, 80.0) * 1.2;
    float sheen2 = pow(NdotH, 200.0) * 2.0;
    float sheen3 = pow(NdotH, 20.0) * 0.15;
    return sheen1 + sheen2 + sheen3;
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    vec3 L1 = normalize(uLightPos - vWorldPosition);
    vec3 L2 = normalize(uLightPos2 - vWorldPosition);
    vec3 ambientDir = vec3(0.0, 1.0, 0.0);

    // === 基础漫反射 ===
    float NdotL1 = max(0.0, dot(N, L1));
    float NdotL2 = max(0.0, dot(N, L2));
    float diffuse = NdotL1 * 0.7 + NdotL2 * 0.3 + 0.15;

    // === 珠层厚度 — 基于球面位置变化 ===
    float nacreThickness = 300.0 + 150.0 * sin(vUv.y * 3.14159 * 4.0 + uTime * 0.1) * cos(vUv.x * 3.14159 * 3.0 + uTime * 0.15);

    // === 薄膜干涉（虹彩）===
    vec3 viewDir = normalize(uCameraPos - vWorldPosition);
    float cosTheta = max(0.0, dot(N, viewDir));
    vec3 iridescence = thinFilmInterference(cosTheta, nacreThickness) * 0.35;

    // === 次表面散射 ===
    float sss1 = subsurfaceScattering(N, V, L1);
    float sss2 = subsurfaceScattering(N, V, L2);
    vec3 subsurface = uSubsurfaceColor * (sss1 * 0.7 + sss2 * 0.3);

    // === 丝绸光泽 ===
    float silk1 = silkSheen(N, V, L1);
    float silk2 = silkSheen(N, V, L2);

    // === 清漆层反射 ===
    vec3 R1 = reflect(-L1, N);
    vec3 R2 = reflect(-L2, N);
    float clearcoat1 = pow(max(0.0, dot(R1, V)), 120.0) * 1.5;
    float clearcoat2 = pow(max(0.0, dot(R2, V)), 120.0) * 1.0;
    float clearcoatSoft = pow(max(0.0, dot(R1, V)), 12.0) * 0.08;

    // === 菲涅尔 ===
    float fresnel = pow(1.0 - cosTheta, 4.0) * 0.6 + 0.05;

    // === 合成 ===
    vec3 baseColor = uBaseColor * diffuse;
    vec3 color = baseColor;
    color += subsurface;
    color += iridescence * (diffuse + 0.3);
    color += uSpecularColor * (silk1 + silk2 * 0.6);
    color += uSpecularColor * (clearcoat1 + clearcoat2);
    color += uSpecularColor * clearcoatSoft;
    color = mix(color, uSpecularColor * 0.85 + iridescence * 0.5, fresnel);

    // === 边缘光（rim light）===
    float rim = pow(1.0 - cosTheta, 3.0) * 0.25;
    color += vec3(0.85, 0.8, 0.95) * rim;

    // === 色调映射 ===
    color = color / (color + vec3(1.0)); // Reinhard
    color = pow(color, vec3(1.0 / 2.2)); // Gamma

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function PearlScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);

    // Camera — push back so pearl appears smaller
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 6);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Pearl geometry — oblate sphere
    const geometry = new THREE.SphereGeometry(1.0, 256, 256);
    const posAttr = geometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      const factor = 1 - Math.abs(y) * 0.06;
      posAttr.setX(i, posAttr.getX(i) * factor);
      posAttr.setZ(i, posAttr.getZ(i) * factor);
    }
    geometry.computeVertexNormals();

    // Custom shader material — purple Edison pearl
    const pearlMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uBaseColor: { value: new THREE.Color(0x8b5a8b) },           // 深紫底色
        uSubsurfaceColor: { value: new THREE.Color(0xd4a0d4) },     // 紫色散射
        uSpecularColor: { value: new THREE.Color(0xffffff) },        // 白色高光
        uIridescentColor1: { value: new THREE.Color(0xc8a2d8) },    // 薰衣草紫
        uIridescentColor2: { value: new THREE.Color(0xa8d8ea) },    // 冰蓝
        uLightPos: { value: new THREE.Vector3(3, 5, 6) },
        uLightPos2: { value: new THREE.Vector3(-4, 2, 4) },
        uCameraPos: { value: camera.position.clone() },
        uTime: { value: 0 },
      },
    });

    const pearl = new THREE.Mesh(geometry, pearlMaterial);
    scene.add(pearl);

    // Ambient lights for fill
    const ambient1 = new THREE.PointLight(0xf0e0f0, 0.8, 20);
    ambient1.position.set(-5, -3, 3);
    scene.add(ambient1);

    const ambient2 = new THREE.PointLight(0xe0e8ff, 0.5, 20);
    ambient2.position.set(5, -1, -3);
    scene.add(ambient2);

    // Mouse tracking
    const mouse = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("touchmove", onTouchMove, { passive: true });

    // Animation loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth rotation
      const targetY = mouse.x * Math.PI * 0.6 + elapsed * 0.08;
      const targetX = mouse.y * Math.PI * 0.2 + Math.sin(elapsed * 0.15) * 0.05;
      pearl.rotation.y += (targetY - pearl.rotation.y) * 0.04;
      pearl.rotation.x += (targetX - pearl.rotation.x) * 0.04;

      // Dynamic lights follow mouse
      pearlMaterial.uniforms.uLightPos.value.set(3 + mouse.x * 3, 5 + mouse.y * 2, 6);
      pearlMaterial.uniforms.uCameraPos.value.copy(camera.position);
      pearlMaterial.uniforms.uTime.value = elapsed;

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      pearlMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-grab active:cursor-grabbing rounded-lg overflow-hidden"
    />
  );
}
