'use client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars, MeshDistortMaterial, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// Objeto 3D Flutuante (Torus Knot - Nó Torcido Futurista)
function CyberShape(props: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const lightRef = useRef<THREE.PointLight>(null!)
  
  // Muda o cursor do mouse ao passar por cima
  useCursor(hovered)

  useFrame((state, delta) => {
    // Rotação contínua
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
    meshRef.current.rotation.y += delta * (hovered ? 1.5 : 0.5) // Gira mais rápido no hover

    // Luz seguindo o mouse (efeito interativo)
    const x = (state.pointer.x * state.viewport.width) / 2
    const y = (state.pointer.y * state.viewport.height) / 2
    lightRef.current.position.set(x, y, 2)
  })

  return (
    <group {...props}>
      <pointLight ref={lightRef} distance={5} intensity={8} color="#00f0ff" />
      
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? 2.2 : 2}
      >
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <MeshDistortMaterial 
            color={hovered ? "#00f0ff" : "#1a1a1a"} 
            emissive={hovered ? "#001a1a" : "#000"}
            roughness={0.1}
            metalness={1}
            distort={0.4} 
            speed={3}
        />
      </mesh>
    </group>
  )
}

export default function Hero3D() {
  return (
    <div className="relative w-full h-[85vh] bg-[#030305] overflow-hidden">
      
      {/* CENA 3D */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={10} color="#ff00aa" />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={10} color="#00f0ff" />
            
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <CyberShape />
            </Float>
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>

      {/* TEXTO E UI (Sobreposto ao 3D) */}
      <div className="absolute inset-0 z-20 flex items-center container mx-auto px-4 pointer-events-none">
        <div className="max-w-3xl pointer-events-auto">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
            >
                <div className="inline-block px-4 py-1 mb-6 border border-cyan-500/30 bg-cyan-900/10 rounded-full backdrop-blur-md">
                    <span className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase glow-text">Next Gen Reality</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-6 drop-shadow-2xl">
                    CYBER <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                        VISION
                    </span>
                </h1>
                
                <p className="text-gray-400 text-lg mb-8 max-w-lg border-l-4 border-cyan-500 pl-6 bg-black/20 backdrop-blur-sm p-4 rounded-r-xl">
                    Mova o cursor para interagir com o núcleo. A fusão perfeita entre performance extrema e design imersivo.
                </p>

                <div className="flex flex-wrap gap-4">
                    <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105 hover:-translate-y-1">
                        ACESSAR LOJA
                    </button>
                    <button className="px-8 py-4 border border-white/10 bg-white/5 text-white font-bold rounded-lg hover:bg-white/10 backdrop-blur-md transition-all">
                        VER DETALHES
                    </button>
                </div>
            </motion.div>
        </div>
      </div>
      
      {/* Gradiente para suavizar a transição para o resto do site */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#030305] to-transparent z-10 pointer-events-none" />
    </div>
  )
}