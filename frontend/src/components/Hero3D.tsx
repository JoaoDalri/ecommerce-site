'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

// --- GEOMETRIAS NATIVAS (ZERO CRASH) ---

// 1. A LUA
function Moon() {
  return (
    <group position={[0, 4, -10]}>
      <mesh>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial color="#ffffcc" emissive="#ffffee" emissiveIntensity={0.1} roughness={0.8} />
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

// 2. O CELULAR (Substituindo RoundedBox por BoxGeometry padrão)
function Cellphone({ grabbed }: { grabbed: boolean }) {
  const group = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (!grabbed && group.current) {
        group.current.rotation.y += 0.01
        group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group ref={group} position={grabbed ? [0, 0, 0] : [0, -0.5, 0]} rotation={grabbed ? [0, Math.PI/2, 0] : [0, -0.5, 0]} scale={grabbed ? 0.7 : 1.0}>
      {/* Corpo */}
      <mesh>
        <boxGeometry args={[0.8, 1.6, 0.1]} />
        <meshStandardMaterial color="#111" metalness={0.9} />
      </mesh>
      {/* Tela */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[0.75, 1.5, 0.01]} />
        <meshStandardMaterial color="black" emissive="#6366f1" emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

// 3. O GATO
function Cat({ phase, time }: { phase: number, time: number }) {
  const group = useRef<THREE.Group>(null!)
  
  useFrame((state, delta) => {
    if (phase === 1 || phase === 4) {
        const speed = phase === 4 ? 25 : 15
        group.current.position.y = Math.sin(time * speed) * 0.2 - 2.0 
        group.current.rotation.z = Math.sin(time * speed) * 0.1
    } else {
        group.current.position.y = -2.0
    }
    
    if (phase === 1) { 
       group.current.position.x -= delta * 3.8 
    }
    
    if (phase === 4) { 
        group.current.rotation.y = -Math.PI / 2 
        group.current.position.x -= delta * 14 
    }
  })

  return (
    <group ref={group} position={[12, -2.0, 0]} rotation={[0, -Math.PI/2, 0]} scale={0.7}>
      {/* Corpo */}
      <mesh>
        <boxGeometry args={[1.2, 0.6, 0.5]} />
        <meshStandardMaterial color="#ff9900" />
      </mesh>
      
      {/* Cabeça */}
      <group position={[0.7, 0.5, 0]}>
        <mesh>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color="#ff9900" />
        </mesh>
        {/* Orelhas */}
        <mesh position={[0.2, 0.4, 0.15]} rotation={[0,0,-0.5]}>
            <coneGeometry args={[0.15, 0.4, 4]} />
            <meshStandardMaterial color="#ff9900" />
        </mesh>
        <mesh position={[0.2, 0.4, -0.15]} rotation={[0,0,-0.5]}>
            <coneGeometry args={[0.15, 0.4, 4]} />
            <meshStandardMaterial color="#ff9900" />
        </mesh>
        {/* Olhos */}
        <mesh position={[0.35, 0.1, 0.15]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.38, 0.1, 0.15]}>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.35, 0.1, -0.15]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.38, 0.1, -0.15]}>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial color="black" />
        </mesh>
      </group>
      
      {/* Rabo */}
      <group position={[-0.6, 0.2, 0]} rotation={[0,0,0.5]}>
        <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.8]} />
            <meshStandardMaterial color="#cc7700" />
        </mesh>
      </group>
      
      {/* Patas */}
      {[0.2, -0.2].map(z => (
          <React.Fragment key={z}>
            <mesh position={[0.4, -0.3, z]}>
                <sphereGeometry args={[0.15]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[-0.4, -0.3, z]}>
                <sphereGeometry args={[0.15]} />
                <meshStandardMaterial color="white" />
            </mesh>
          </React.Fragment>
      ))}
    </group>
  )
}

// 4. O COOL GUY (Substituindo RoundedBox por BoxGeometry)
function CoolGuy({ onGrab }: { onGrab: () => void }) {
  const group = useRef<THREE.Group>(null!)
  const leftArm = useRef<THREE.Group>(null!)
  const rightArm = useRef<THREE.Group>(null!)
  const head = useRef<THREE.Group>(null!)
  
  const [phase, setPhase] = useState(0) 
  const [hasPhone, setHasPhone] = useState(false)
  const time = useRef(0)

  useFrame((state, delta) => {
    time.current += delta
    const t = time.current

    if (phase === 0 && t > 1.0) setPhase(1)

    if (phase === 1) {
        group.current.position.x -= delta * 4 
        group.current.position.y = Math.sin(t * 10) * 0.1 - 0.5 
        group.current.rotation.z = Math.sin(t * 10) * 0.05
        leftArm.current.rotation.x = Math.sin(t * 10) * 0.5
        rightArm.current.rotation.x = -Math.sin(t * 10) * 0.5
        if (group.current.position.x <= 1.2) {
            setPhase(2)
            time.current = 0 
        }
    }

    if (phase === 2) {
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -0.5, 0.1)
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.1)
        leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, -1.5, 0.1) 
        if (leftArm.current.rotation.x < -1.4 && !hasPhone) {
            onGrab()
            setHasPhone(true)
            setPhase(3) 
            time.current = 0
        }
    }

    if (phase === 3) {
        leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, -2.0, 0.1)
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -0.5, 0.05)
        head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, -0.5, 0.1)
        if (t > 1.5) setPhase(4)
    }

    if (phase === 4) {
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -Math.PI / 2, 0.2)
        group.current.rotation.x = 0.3 
        group.current.position.x -= delta * 12 
        group.current.position.y = Math.sin(t * 20) * 0.3 - 0.5
        leftArm.current.rotation.x = Math.sin(t * 20) * 1.5
        rightArm.current.rotation.x = -Math.sin(t * 20) * 1.5
    }
  })

  return (
    <>
      <group ref={group} position={[9, -0.5, 0]} rotation={[0, -Math.PI/2, 0]}>
        {/* Cabeça */}
        <group ref={head} position={[0, 1.5, 0]}>
            <mesh>
                <boxGeometry args={[0.6, 0.7, 0.6]} />
                <meshStandardMaterial color="#ffccaa" />
            </mesh>
            {/* Cabelo */}
            <mesh position={[0, 0.35, 0]}>
                <boxGeometry args={[0.65, 0.2, 0.65]} />
                <meshStandardMaterial color="#221100" />
            </mesh>
            {/* Óculos */}
            <mesh position={[0, 0.05, 0.32]}>
                <boxGeometry args={[0.5, 0.15, 0.1]} />
                <meshStandardMaterial color="black" />
            </mesh>
        </group>

        {/* Corpo (Jaqueta) */}
        <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.9, 1.2, 0.5]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>
        {/* Camiseta */}
        <mesh position={[0, 0.5, 0.26]}>
            <boxGeometry args={[0.3, 1.2, 0.1]} />
            <meshStandardMaterial color="white" />
        </mesh>

        {/* Braços */}
        <group ref={leftArm} position={[0.55, 1.0, 0]}>
            <mesh position={[0, -0.4, 0]}>
                <boxGeometry args={[0.22, 0.9, 0.22]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0, -0.9, 0]}>
                <sphereGeometry args={[0.15]} />
                <meshStandardMaterial color="#ffccaa"/>
            </mesh>
            {hasPhone && (<group position={[0, -1.0, 0.2]} rotation={[Math.PI/2, 0, 0]}><Cellphone grabbed={true} /></group>)}
        </group>
        <group ref={rightArm} position={[-0.55, 1.0, 0]}>
            <mesh position={[0, -0.4, 0]}>
                <boxGeometry args={[0.22, 0.9, 0.22]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0, -0.9, 0]}>
                <sphereGeometry args={[0.15]} />
                <meshStandardMaterial color="#ffccaa"/>
            </mesh>
        </group>
      </group>
      
      <Cat phase={phase} time={time.current} />
    </>
  )
}

export default function Hero3D() {
  const [stolen, setStolen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="h-[85vh] bg-[#050505]" />

  return (
    <div className="relative w-full h-[85vh] bg-[#050505] overflow-hidden border-b border-white/10">
      
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 1, 7], fov: 40 }} shadows>
            <color attach="background" args={['#050505']} />
            <ambientLight intensity={0.2} />
            <Moon />
            <spotLight position={[5, 5, 5]} angle={0.5} penumbra={1} intensity={10} color="#6366f1" />
            <pointLight position={[-5, 2, 2]} intensity={5} color="#ec4899" />

            {!stolen && <Float speed={2} rotationIntensity={0.5}><Cellphone grabbed={false} /></Float>}

            <CoolGuy onGrab={() => setStolen(true)} />
            
            <Stars radius={100} depth={50} count={5000} factor={4} fade />
            <fog attach="fog" args={['#050505', 5, 30]} />
        </Canvas>
      </div>

      <div className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${stolen ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-center mt-[-50px]">
            <h1 className="text-8xl font-black text-white tracking-tighter drop-shadow-2xl">
                CYBER <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">CHASE</span>
            </h1>
            <p className="text-gray-400 text-xl mt-4 bg-black/50 backdrop-blur-md inline-block px-6 py-2 rounded-full border border-white/10">
                A caçada tecnológica começou.
            </p>
        </div>
      </div>
    </div>
  )
}