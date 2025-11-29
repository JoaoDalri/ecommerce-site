import os

BASE_DIR = 'src/components'

files = {
    f'{BASE_DIR}/Hero3D.tsx': r'''
'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion-3d' 

// --- ELEMENTOS DA CENA ---

// 1. A LUA (Fundo)
function Moon() {
  return (
    <group position={[0, 4, -10]}>
      <mesh>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial 
            color="#ffffcc" 
            emissive="#ffffee"
            emissiveIntensity={0.1}
            roughness={0.8}
        />
      </mesh>
      {/* Crateras */}
      <mesh position={[2, 1, 3]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#eec" />
      </mesh>
      <mesh position={[-1.5, -2, 3.2]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#eec" />
      </mesh>
      <pointLight distance={30} intensity={2} color="#aaaaff" />
    </group>
  )
}

// 2. O CELULAR INTERATIVO
function InteractivePhone() {
  const group = useRef<THREE.Group>(null!)
  const [hovered, setHover] = useState(false)
  
  // Muda o cursor para "pointer" quando passa o mouse
  useCursor(hovered)

  useFrame((state, delta) => {
    // Rotação suave contínua
    if (!hovered) {
        group.current.rotation.y += delta * 0.2
        group.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1
    } else {
        // Quando hover, o celular "olha" para o mouse suavemente
        // (Isso seria mais complexo, vamos fazer ele parar e encarar de frente)
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0, 0.1)
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, 0.1)
    }
  })

  return (
    <group 
        ref={group} 
        onPointerOver={() => setHover(true)} 
        onPointerOut={() => setHover(false)}
        scale={hovered ? 1.1 : 1} // Leve zoom no hover
    >
      {/* Corpo do Celular */}
      <mesh>
        <boxGeometry args={[1.0, 2.0, 0.1]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Tela (Muda de cor/intensidade no hover) */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[0.9, 1.9, 0.01]} />
        <meshStandardMaterial 
            color={hovered ? "#000" : "#111"} 
            emissive={hovered ? "#6366f1" : "#222"} // Brilha forte no hover
            emissiveIntensity={hovered ? 2 : 0.5} 
        />
      </mesh>

      {/* Detalhe da Câmera */}
      <group position={[0.25, 0.7, 0.06]}>
         <mesh position={[0,0,0]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="#333" />
         </mesh>
         <mesh position={[-0.2,0,0]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="#333" />
         </mesh>
      </group>
    </group>
  )
}

export default function Hero3D() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="h-[85vh] bg-[#050505]" />

  return (
    <div className="relative w-full h-[85vh] bg-[#050505] overflow-hidden border-b border-white/10">
      
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} shadows>
            <color attach="background" args={['#050505']} />
            
            <ambientLight intensity={0.2} />
            <spotLight position={[5, 5, 5]} angle={0.5} penumbra={1} intensity={10} color="#6366f1" />
            <pointLight position={[-5, 2, 2]} intensity={5} color="#ec4899" />

            <Moon /> {/* A Lua continua lá atrás */}

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <InteractivePhone />
            </Float>
            
            <Stars radius={100} depth={50} count={5000} factor={4} fade />
            <fog attach="fog" args={['#050505', 5, 30]} />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="text-center mt-40"> {/* Empurrado pra baixo para não tapar o celular */}
            <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl opacity-80">
                CYBER <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">PHONE</span>
            </h1>
            <p className="text-gray-400 text-lg mt-2 bg-black/50 backdrop-blur-md inline-block px-4 py-1 rounded-full border border-white/10">
                Passe o mouse para ativar
            </p>
        </div>
      </div>
    </div>
  )
}
'''
}

for path, content in files.items():
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip())

print("✅ Cena Limpa: Celular Interativo + Lua (Sem Robô/Gato).")
print("Reinicie o servidor para ver o resultado.")