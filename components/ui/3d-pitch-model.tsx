'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment, Text } from '@react-three/drei'
import * as THREE from 'three'
import { type Ground } from '@/lib/grounds'

// --- Custom Pitch Shader ---
const pitchVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const pitchFragmentShader = `
  varying vec2 vUv;
  uniform float uSpin;
  uniform float uPace;
  uniform float uDeterioration;
  uniform float uTime;

  // Simple 2D noise for pitch texture
  vec2 hash( vec2 p ) {
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
  }
  
  float noise( in vec2 p ) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor( p + (p.x+p.y)*K1 );
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    vec3 n = h*h*h*h*vec3( dot(a,hash(i+vec2(0.0))), dot(b,hash(i+o)), dot(c,hash(i+vec2(1.0))));
    return dot( n, vec3(70.0) );
  }

  // Heatmap Color Ramp Function
  vec3 getHeatmapColor(float value) {
    float v = clamp(value, 0.0, 1.0);
    // Dark Blue -> Cyan -> Green -> Yellow -> Red -> Deep Red
    vec3 col = mix(vec3(0.0, 0.0, 0.8), vec3(0.0, 0.8, 1.0), smoothstep(0.0, 0.2, v));
    col = mix(col, vec3(0.0, 1.0, 0.0), smoothstep(0.2, 0.45, v));
    col = mix(col, vec3(1.0, 1.0, 0.0), smoothstep(0.45, 0.7, v));
    col = mix(col, vec3(1.0, 0.1, 0.0), smoothstep(0.7, 0.9, v));
    col = mix(col, vec3(0.6, 0.0, 0.0), smoothstep(0.9, 1.0, v));
    return col;
  }

  // Gaussian Blob function
  float blob(vec2 uv, vec2 center, float spread, float intensity) {
    // Invert uniform y because uv.y=1 is top, we want to map correctly depending on camera
    vec2 diff = uv - center;
    // Compress X to make the blobs slightly oval (forward momentum of ball)
    diff.x *= 1.5; 
    return exp(-dot(diff, diff) * spread) * intensity;
  }

  void main() {
    float paceFactor = uPace / 100.0;
    float spinFactor = uSpin / 100.0;
    float detFactor = uDeterioration / 100.0;

    // 1. Base Soil Generation
    vec3 greenPitch = vec3(0.55, 0.65, 0.45);
    vec3 dustyPitch = vec3(0.75, 0.65, 0.50);
    vec3 baseColor = mix(dustyPitch, greenPitch, paceFactor / (paceFactor + spinFactor + 0.1));
    
    // Noise to make it look porous/sandy
    float n1 = noise(vUv * 80.0);
    baseColor *= (0.95 + 0.05 * n1);
    
    // Add Deterioration Dust (mostly near ends)
    float dustZone = smoothstep(0.4, 0.1, vUv.y) + smoothstep(0.6, 0.9, vUv.y);
    float dustNoise = noise(vUv * 120.0);
    baseColor = mix(baseColor, vec3(0.8, 0.7, 0.5), dustNoise * dustZone * detFactor * 0.5);

    // 2. Crease Lines & Broadcast Lines
    float lines = 0.0;
    // Outer Border Line
    if (abs(vUv.x - 0.02) < 0.005 || abs(vUv.x - 0.98) < 0.005) lines = 1.0;
    // Stumps Popping Crease
    if (abs(vUv.y - 0.1) < 0.003 || abs(vUv.y - 0.9) < 0.003) lines = 1.0;
    // Broadcast Length Dividers (Dashed roughly)
    float dash = step(0.5, fract(vUv.x * 20.0));
    // HALF
    if (abs(vUv.y - 0.25) < 0.002) lines = max(lines, dash * 0.8);
    // SHORT
    if (abs(vUv.y - 0.45) < 0.002) lines = max(lines, dash * 0.8);
    // GOOD
    if (abs(vUv.y - 0.7) < 0.002) lines = max(lines, dash * 0.8);
    // FULL
    if (abs(vUv.y - 0.82) < 0.002) lines = max(lines, dash * 0.8);

    // Apply Lines
    vec3 colorWithLines = mix(baseColor, vec3(0.9, 0.9, 0.9), lines);

    // 3. Heatmap Calculation
    // We combine multiple "blobs" to create the overall heat network.
    
    // Pace Blob (Short/Good length, center line)
    // Pulsing slightly
    float pulse = 0.9 + 0.1 * sin(uTime * 3.0);
    float heat = blob(vUv, vec2(0.55, 0.55), 40.0, paceFactor * 0.85 * pulse); // Short/Good
    heat += blob(vUv, vec2(0.48, 0.40), 50.0, paceFactor * 0.6); // Short
    
    // Spin Blobs (Good/Full length, wide roughs outside off-stump)
    float pulse2 = 0.9 + 0.1 * cos(uTime * 2.0);
    heat += blob(vUv, vec2(0.25, 0.75), 60.0, (spinFactor + detFactor * 0.5) * 0.8 * pulse2); // Rough Off
    heat += blob(vUv, vec2(0.78, 0.68), 50.0, (spinFactor + detFactor * 0.5) * 0.7); // Rough Leg

    // Add a trailing streak down the pitch
    heat += blob(vUv, vec2(0.5, 0.65), 10.0, 0.15); 

    // Cap Heat
    heat = clamp(heat, 0.0, 1.0);

    // 4. Final Blending
    // If heat is low, it's completely transparent (shows soil). 
    // If high, fully opaque heatmap colors.
    vec3 heatColor = getHeatmapColor(heat);
    float heatOpacity = smoothstep(0.1, 0.4, heat); // Minimum threshold to start seeing color
    
    // Create a glowing halo around the Heatmap
    float halo = smoothstep(0.02, 0.15, heat) - smoothstep(0.15, 0.3, heat);
    vec3 finalComposite = mix(colorWithLines, heatColor * 1.2, heatOpacity * 0.85); // Increased heat bloom
    finalComposite += vec3(0.1, 0.3, 0.6) * halo * 0.5; // Stronger blue halo glow
    
    gl_FragColor = vec4(finalComposite, 1.0);
  }
`

function CameraController() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  
  useFrame(() => {
    // Look down the pitch slightly towards the far stumps
    if (cameraRef.current) {
      cameraRef.current.lookAt(0, 0, -4)
    }
  })
  
  // Positioned "Behind the bowler": High Y, Positive Z
  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 4.5, 11]} fov={38} />
}

function Stumps({ position }: { position: [number, number, number] }) {
  // 3 simplistic white cylindrical stumps
  return (
    <group position={position}>
      <mesh position={[-0.25, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1, 16]} />
        <meshStandardMaterial color="#eeeeee" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1, 16]} />
        <meshStandardMaterial color="#eeeeee" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0.25, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1, 16]} />
        <meshStandardMaterial color="#eeeeee" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Bails */}
      <mesh position={[-0.125, 1.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.23, 8]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>
      <mesh position={[0.125, 1.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.23, 8]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>
    </group>
  )
}

function PitchSurface({ ground }: { ground: Ground }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <group>
      {/* The Heatmap Pitch Plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.5, 20, 64, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={pitchVertexShader}
          fragmentShader={pitchFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uSpin: { value: ground.traits.Spin },
            uPace: { value: ground.traits.Pace },
            uDeterioration: { value: ground.traits.Deterioration },
          }}
        />
      </mesh>
      
      {/* Pitch Cutout Depth Illusion */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
         <boxGeometry args={[3.6, 0.09, 20.1]} />
         <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  )
}

function BroadcastLabels() {
  const textProps = {
    color: "rgba(255,255,255,0.7)",
    fontSize: 0.35,
    font: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf",
    anchorX: "left" as const,
    anchorY: "middle" as const,
    rotation: [-Math.PI / 2, 0, 0] as [number, number, number],
  }

  // Z-positions correspond inversely to the shader's vUv.y logic
  // Center is Z=0. Bowling end is Z=10. Batting end is Z=-10.
  // vUv.y = 1 -> Z = -10. vUv.y = 0 -> Z = 10.
  // Converting vUv.y to Z: Z = 10 - (vUv.y * 20)

  // FULL (Shader: 0.82) -> Z = 10 - 16.4 = -6.4
  // GOOD (Shader: 0.70) -> Z = 10 - 14.0 = -4.0
  // SHORT (Shader: 0.45) -> Z = 10 - 9.0 = 1.0
  // HALF (Shader: 0.25) -> Z = 10 - 5.0 = 5.0

  return (
    <group position={[1.8, 0.01, 0]}>
      <Text position={[0, 0, -6.4]} {...textProps}>FULL</Text>
      <Text position={[0, 0, -4.0]} {...textProps}>GOOD</Text>
      <Text position={[0, 0, 1.0]} {...textProps}>SHORT</Text>
      <Text position={[0, 0, 5.0]} {...textProps}>HALF</Text>
      
      {/* Line Blocks on Bottom Edge */}
      <group position={[-1.8, 0, 8.5]}>
         {/* Behind the stumps boxes */}
         <mesh position={[-0.8, 0, 0]} rotation={[-Math.PI/2,0,0]}>
            <planeGeometry args={[0.9, 0.8]}/>
            <meshBasicMaterial color="rgba(0,0,0,0.4)" transparent />
         </mesh>
         <Text position={[-0.8, 0.01, 0]} fontSize={0.25} anchorX="center" anchorY="middle" rotation={[-Math.PI/2,0,0]}>OFF</Text>
         
         <mesh position={[0, 0, 0]} rotation={[-Math.PI/2,0,0]}>
            <planeGeometry args={[0.9, 0.8]}/>
            <meshBasicMaterial color="rgba(0,0,0,0.4)" transparent />
         </mesh>
         <Text position={[0, 0.01, 0]} fontSize={0.25} anchorX="center" anchorY="middle" rotation={[-Math.PI/2,0,0]}>MID</Text>
         
         <mesh position={[0.8, 0, 0]} rotation={[-Math.PI/2,0,0]}>
            <planeGeometry args={[0.9, 0.8]}/>
            <meshBasicMaterial color="rgba(0,0,0,0.4)" transparent />
         </mesh>
         <Text position={[0.8, 0.01, 0]} fontSize={0.25} anchorX="center" anchorY="middle" rotation={[-Math.PI/2,0,0]}>LEG</Text>
      </group>
    </group>
  )
}

export function InteractivePitchModel({ ground }: { ground: Ground }) {
  // Generate dynamic explanation based on dominant traits
  const generateExplanation = () => {
    const { Spin, Pace, Bounce, Deterioration } = ground.traits
    if (Spin > 70 || Deterioration > 80) {
      return "The thermal zones are heavily concentrated on the spun-out roughs outside off-stump at a GOOD to FULL length. Expect significant deterioration and unpredictable turn."
    }
    if (Pace > 60 || Bounce > 60) {
      return "The heat is focused centrally on a SHORT length. This highlights a hard, bouncy surface optimal for pace bowlers attacking the body and exploiting carry."
    }
    return "The heat distribution is mild across a GOOD length. This suggests a true-paced surface prioritizing swing early on, quickly flattening into a reliable batting paradise."
  }

  return (
    <div className="w-full flex-col flex rounded-[2rem] bg-zinc-950 border border-white/5 overflow-hidden shadow-[inset_0_2px_20px_rgba(0,0,0,1)] group">
      
      {/* Container for the 3D Model */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        {/* TV Broadcast Banner */}
        <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
           <div className="bg-zinc-200 text-zinc-800 px-6 py-2">
              <h4 className="text-sm font-black tracking-widest uppercase">HitTheDeck Intelligence</h4>
           </div>
           <div className="flex bg-zinc-900/90 text-white font-mono text-sm border-b border-white/10">
              <div className="px-5 py-2 border-r border-white/10 flex items-center justify-center">
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className="px-5 py-2 font-black tracking-widest text-teal-400">
                 {ground.short.toUpperCase()} VENUE
              </div>
           </div>
        </div>
        
        {/* gl={{ preserveDrawingBuffer: true }} is mandatory to allow HTML-to-Image / jsPDF 
            to successfully snapshot the WebGL context without capturing a black frame. */}
        <Canvas shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }}>
          <CameraController />
          
          <Environment preset="city" />
          <ambientLight intensity={0.8} />
          {/* Soft stadium fill light */}
          <directionalLight position={[0, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
          <pointLight position={[0, 2, -5]} intensity={1.5} color="#14b8a6" distance={15} />

          {/* Global Outfield Grass */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
            <planeGeometry args={[150, 150]} />
            <meshStandardMaterial color="#0f451f" roughness={0.9} metalness={0.0} />
          </mesh>

          {/* The Action Plane */}
          <PitchSurface ground={ground} />
          <BroadcastLabels />

          {/* Near Stumps (Bowling End) */}
          <Stumps position={[0, 0, 8]} />
          
          {/* Far Stumps (Batting End) */}
          <Stumps position={[0, 0, -8]} />
          
        </Canvas>
      </div>

      {/* Intelligence Explanation Panel */}
      <div className="bg-zinc-900/80 p-6 border-t border-white/5 flex items-start gap-4">
        <div className="p-3 bg-red-500/10 rounded-xl text-red-500 mt-1 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M8 15h8"/></svg>
        </div>
        <div>
          <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Tactical Breakdown</h4>
          <p className="text-[15px] font-medium text-zinc-200 leading-snug">
            {generateExplanation()}
          </p>
        </div>
      </div>

    </div>
  )
}
