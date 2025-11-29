'use client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, RoundedBox, Capsule, Sphere, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// --- COMPONENTES DA CENA ---

function Cellphone({ grabbed }: { grabbed: boolean }) {
  const group = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (!grabbed && group.current) {
        // Flutuação suave (Idle)
        group.current.rotation.y += 0.005
        group.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05
        group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  // Posição: Se não foi pego, fica no centro levemente à direita. Se foi pego, vai para a origem do pai (mão do robô)
  return (
    <group ref={group} position={grabbed ? [0,0,0] : [1.5, 0, 0]} rotation={grabbed ? [0,0,0] : [0, -0.5, 0]}>
      {/* Corpo */}
      <RoundedBox args={[1.0, 2.0, 0.1]} radius={0.05}><meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} /></RoundedBox>
      {/* Tela Neon */}
      <RoundedBox args={[0.9, 1.9, 0.01]} radius={0.02} position={[0, 0, 0.06]}><meshStandardMaterial color="#000" emissive="#6366f1" emissiveIntensity={0.8} /></RoundedBox>
      {/* Câmeras */}
      <group position={[0.25, 0.7, 0.06]}>
         <Sphere args={[0.08]} position={[0,0,0]}><meshStandardMaterial color="#333" /></Sphere>
         <Sphere args={[0.08]} position={[-0.2,0,0]}><meshStandardMaterial color="#333" /></Sphere>
      </group>
    </group>
  )
}

function RobotThief({ onGrab }: { onGrab: () => void }) {
  const group = useRef<THREE.Group>(null!)
  const [phase, setPhase] = useState(0) // 0:Espera, 1:Entra, 2:Pega, 3:Olha, 4:Foge
  const [hasPhone, setHasPhone] = useState(false)
  
  // Timer local para garantir que a animação rode lisa independente do load da página
  const localTime = useRef(0)

  useFrame((state, delta) => {
    localTime.current += delta
    const t = localTime.current

    // FASE 0: Espera inicial (1 segundo)
    if (phase === 0 && t > 1.0) {
        setPhase(1)
    }

    // FASE 1: Entra correndo da direita
    if (phase === 1) {
        // Move para a esquerda
        group.current.position.x -= delta * 6
        
        // Animação de "pulo" ao correr
        group.current.position.y = Math.sin(t * 15) * 0.3 - 0.5
        group.current.rotation.z = Math.sin(t * 15) * 0.2

        // Chegou no celular? (x <= 2.2)
        if (group.current.position.x <= 2.2) {
            setPhase(2)
        }
    }

    // FASE 2: Pega o celular
    if (phase === 2) {
        if (!hasPhone) {
            onGrab() // Avisa o pai que roubou
            setHasPhone(true)
        }
        // Ajusta posição exata para pegar
        group.current.position.x = 2.0 
        group.current.rotation.z = 0
        setPhase(3)
        localTime.current = 0 // Reseta timer para contar o tempo da "encarada"
    }

    // FASE 3: Olha para o usuário (Deboche)
    if (phase === 3) {
        // Interpola rotação suavemente para frente
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -0.5, 0.1)
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, 0.1)
        
        // Fica encarando por 1.5 segundos
        if (t > 1.5) {
            setPhase(4)
        }
    }

    // FASE 4: Sai correndo para a esquerda
    if (phase === 4) {
        group.current.position.x -= delta * 12 // Velocidade de fuga
        group.current.position.y = Math.sin(t * 25) * 0.4 // Pulos rápidos
        group.current.rotation.y = -Math.PI / 2 // Vira de lado
        group.current.rotation.z = -0.5 // Inclina pra frente (aerodinâmica)
    }
  })

  return (
    // Começa fora da tela na direita (x=12)
    <group ref={group} position={[12, -1, 0]} rotation={[0, -1.5, 0]}>
      
      {/* Cabeça */}
      <RoundedBox args={[0.7, 0.6, 0.6]} radius={0.15} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#eee" metalness={0.6} roughness={0.2} />
      </RoundedBox>
      
      {/* Olhos (Mudam de cor quando rouba) */}
      <mesh position={[0.18, 1.55, 0.31]}>
        <circleGeometry args={[0.1]} />
        <meshBasicMaterial color={hasPhone ? "#ff0000" : "#00ff00"} />
      </mesh>
      <mesh position={[-0.18, 1.55, 0.31]}>
        <circleGeometry args={[0.1]} />
        <meshBasicMaterial color={hasPhone ? "#ff0000" : "#00ff00"} />
      </mesh>

      {/* Corpo */}
      <Capsule args={[0.45, 1.2]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color={hasPhone ? "#ff0055" : "#ec4899"} metalness={0.5} />
      </Capsule>

      {/* Braços */}
      <group position={[0.6, 0.8, 0]} rotation={[0,0,-0.5]}>
        <Capsule args={[0.12, 0.7]}><meshStandardMaterial color="#333" /></Capsule>
      </group>
      <group position={[-0.6, 0.8, 0]} rotation={[0,0,0.5]}>
        <Capsule args={[0.12, 0.7]}><meshStandardMaterial color="#333" /></Capsule>
      </group>

      {/* O Celular Roubado (Aparece na mão) */}
      {hasPhone && (
        <group position={[-0.7, 0.7, 0.5]} rotation={[0, 1.5, -0.5]}>
            <Cellphone grabbed={true} />
        </group>
      )}
    </group>
  )
}

// --- CENA PRINCIPAL ---

export default function Hero3D() {
  const [stolen, setStolen] = useState(false)

  return (
    <div className="relative w-full h-[85vh] bg-[#050505] overflow-hidden">
      
      {/* CANVAS 3D */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 8], fov: 35 }}> {/* FOV menor e câmera mais longe para "achatamento" cinemático */}
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 10, 5]} angle={0.5} penumbra={1} intensity={20} color="#6366f1" />
            <pointLight position={[-5, 0, 5]} intensity={5} color="#ec4899" />
            
            {/* Se não foi roubado, renderiza o celular flutuando sozinho */}
            {!stolen && <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}><Cellphone grabbed={false} /></Float>}
            
            {/* O Ladrão */}
            <RobotThief onGrab={() => setStolen(true)} />
            
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>

      {/* UI / TEXTO (Desaparece quando o roubo acontece para focar na ação) */}
      {!stolen && (
        <div className="absolute inset-0 z-20 flex items-center container mx-auto px-4 pointer-events-none">
            <div className="max-w-2xl pointer-events-auto mt-10">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
                    <div className="inline-block px-4 py-1 mb-6 border border-indigo-500/30 bg-indigo-500/10 rounded-full backdrop-blur-md">
                        <span className="text-indigo-400 text-xs font-bold tracking-[0.3em] uppercase glow-text">Cyber Week</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-6 drop-shadow-2xl">
                        FUTURE <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            TECH
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-8 max-w-lg border-l-4 border-indigo-500 pl-6">
                        Proteja seu setup. A tecnologia aqui é tão avançada que ganha vida própria.
                    </p>
                    <button className="px-8 py-4 bg-white text-black font-bold rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
                        VER OFERTAS
                    </button>
                </motion.div>
            </div>
        </div>
      )}
      
      {/* Overlay Gradiente na base */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
    </div>
  )
}