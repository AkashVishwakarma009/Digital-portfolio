import { useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, Text, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

export type RoomTarget = 'projects' | 'skills' | 'about' | 'experience' | 'contact'
type Props = { onSelect: (target: RoomTarget) => void; compact: boolean }

function GlowOrb({ position, color, scale = 0.18 }: { position: [number, number, number]; color: string; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => { if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.4 + position[0]) * 0.08 })
  return <mesh ref={ref} position={position}><sphereGeometry args={[scale, 24, 24]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.4} /></mesh>
}

function ClickObject({ position, size, color, label, target, onSelect, children }: {
  position: [number, number, number]; size: [number, number, number]; color: string; label: string;
  target: RoomTarget; onSelect: (target: RoomTarget) => void; children?: ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return <group position={position}>
    <mesh onClick={(e) => { e.stopPropagation(); onSelect(target) }} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }} onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={hovered ? '#273b68' : color} emissive={hovered ? '#287bff' : '#101b36'} emissiveIntensity={hovered ? 1.3 : 0.25} metalness={0.55} roughness={0.3} />
    </mesh>
    {children}
    <Text position={[0, size[1] / 2 + 0.22, 0.12]} fontSize={0.15} color={hovered ? '#8edfff' : '#a9b8d6'} anchorX="center">{label}</Text>
    {hovered && <pointLight color="#438cff" intensity={2} distance={2.5} />}
  </group>
}

function Scene({ onSelect, compact }: Props) {
  const group = useRef<THREE.Group>(null!)
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, (state.pointer.x * 0.07), 3, delta)
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, (-state.pointer.y * 0.025), 3, delta)
    }
  })
  return <>
    <color attach="background" args={['#070912']} />
    <fog attach="fog" args={['#070912', 8, 19]} />
    <ambientLight intensity={0.6} />
    <directionalLight position={[3, 6, 4]} intensity={1.5} castShadow />
    <pointLight position={[-3, 2, -2]} color="#4b69ff" intensity={22} distance={10} />
    <pointLight position={[3, 2, -3]} color="#9b4dff" intensity={18} distance={9} />
    <Stars radius={35} depth={18} count={compact ? 450 : 1100} factor={2.2} fade speed={0.5} />
    <group ref={group}>
      {/* room shell */}
      <mesh position={[0, -0.12, 0]} receiveShadow><boxGeometry args={[10, 0.25, 7]} /><meshStandardMaterial color="#111827" metalness={0.35} roughness={0.55} /></mesh>
      <mesh position={[0, 2.6, -3.5]}><boxGeometry args={[10, 5.2, 0.18]} /><meshStandardMaterial color="#10182a" roughness={0.8} /></mesh>
      <mesh position={[-4.9, 2.6, 0]}><boxGeometry args={[0.18, 5.2, 7]} /><meshStandardMaterial color="#11182a" /></mesh>
      <mesh position={[4.9, 2.6, 0]}><boxGeometry args={[0.18, 5.2, 7]} /><meshStandardMaterial color="#11182a" /></mesh>
      {/* floor light strips */}
      <mesh position={[0, 0.015, 2.8]}><boxGeometry args={[8.5, 0.025, 0.035]} /><meshStandardMaterial color="#3e8dff" emissive="#176bff" emissiveIntensity={2.5} /></mesh>
      <mesh position={[-4.2, 0.02, 0]}><boxGeometry args={[0.035, 0.025, 5.6]} /><meshStandardMaterial color="#854dff" emissive="#854dff" emissiveIntensity={2} /></mesh>
      {/* desk */}
      <mesh position={[0, 1.05, -1.1]} castShadow><boxGeometry args={[4.3, 0.16, 1.35]} /><meshStandardMaterial color="#20283b" metalness={0.5} roughness={0.3} /></mesh>
      {[-1.8, 1.8].map(x => <mesh key={x} position={[x, 0.52, -1.1]}><boxGeometry args={[0.12, 1, 1.05]} /><meshStandardMaterial color="#303b50" metalness={0.6} /></mesh>)}
      {/* monitor pair */}
      <mesh position={[-0.78, 1.95, -1.5]}><boxGeometry args={[1.55, 1.05, 0.1]} /><meshStandardMaterial color="#080d18" metalness={0.8} /></mesh>
      <mesh position={[-0.78, 1.95, -1.435]}><planeGeometry args={[1.4, 0.9]} /><meshBasicMaterial color="#102a50" /></mesh>
      <mesh position={[0.92, 1.95, -1.5]}><boxGeometry args={[1.55, 1.05, 0.1]} /><meshStandardMaterial color="#080d18" metalness={0.8} /></mesh>
      <mesh position={[0.92, 1.95, -1.435]}><planeGeometry args={[1.4, 0.9]} /><meshBasicMaterial color="#171b42" /></mesh>
      <Text position={[-0.78, 2.05, -1.42]} fontSize={0.12} color="#60baff" anchorX="center">{"< BUILD />"}</Text>
      <Text position={[0.92, 2.05, -1.42]} fontSize={0.105} color="#a98aff" anchorX="center">THE DIGITAL ROOM</Text>
      <mesh position={[0, 1.52, -1.5]}><boxGeometry args={[0.12, 0.75, 0.12]} /><meshStandardMaterial color="#46536b" metalness={0.8} /></mesh>
      <ClickObject position={[0, 1.98, -1.37]} size={[3.5, 1.25, 0.12]} color="#111a2b" label="PROJECTS / CLICK MONITOR" target="projects" onSelect={onSelect} />
      {/* keyboard and mouse */}
      <mesh position={[0, 1.17, -0.35]} rotation={[-0.12, 0, 0]}><boxGeometry args={[1.35, 0.06, 0.42]} /><meshStandardMaterial color="#080d16" metalness={0.8} /></mesh>
      <mesh position={[1.15, 1.17, -0.35]}><boxGeometry args={[0.25, 0.08, 0.38]} /><meshStandardMaterial color="#28344a" /></mesh>
      {/* interactive side objects */}
      <ClickObject position={[-3.3, 1.8, -2.9]} size={[1.05, 1.35, 0.16]} color="#1a2740" label="ABOUT ME" target="about" onSelect={onSelect}>
        <mesh position={[0, 0, 0.1]}><planeGeometry args={[0.82, 1.1]} /><meshBasicMaterial color="#152e51" /></mesh>
        <Text position={[0, 0, 0.2]} fontSize={0.12} color="#a8d7ff" anchorX="center">PROFILE</Text>
      </ClickObject>
      <ClickObject position={[3.35, 1.55, -2.8]} size={[1.05, 1.65, 0.2]} color="#29203d" label="EXPERIENCE" target="experience" onSelect={onSelect}>
        {[0, 1, 2].map((i) => <mesh key={i} position={[0, -0.45 + i * 0.42, 0.13]}><boxGeometry args={[0.72, 0.32, 0.06]} /><meshStandardMaterial color={['#3863a0', '#6a4c9d', '#277c85'][i]} /></mesh>)}
      </ClickObject>
      <ClickObject position={[-2.8, 1.15, 0.55]} size={[1.25, 0.75, 0.18]} color="#172d3b" label="SKILLS" target="skills" onSelect={onSelect}>
        <Text position={[0, 0, 0.12]} fontSize={0.14} color="#69e5ff" anchorX="center">TECH STACK</Text>
      </ClickObject>
      <ClickObject position={[2.85, 1.1, 0.55]} size={[1.15, 0.68, 0.18]} color="#1d2c42" label="CONTACT TERMINAL" target="contact" onSelect={onSelect}>
        <Text position={[0, 0, 0.12]} fontSize={0.11} color="#7ef5cf" anchorX="center">{"> HELLO_"}</Text>
      </ClickObject>
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
        <mesh position={[-2.2, 3.2, -1.7]}><octahedronGeometry args={[0.25]} /><meshStandardMaterial color="#62aaff" emissive="#277bff" emissiveIntensity={1.5} wireframe /></mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.25}>
        <mesh position={[2.25, 3.1, -1.9]}><icosahedronGeometry args={[0.28, 1]} /><meshStandardMaterial color="#b77aff" emissive="#773dff" emissiveIntensity={1.3} wireframe /></mesh>
      </Float>
      <GlowOrb position={[-3.8, 2.8, 0.8]} color="#448dff" />
      <GlowOrb position={[3.8, 2.9, 0.5]} color="#a45cff" />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.45} scale={10} blur={2.5} far={4} />
    </group>
  </>
}

export default function Room({ onSelect, compact }: Props) {
  return <Canvas shadows camera={{ position: [0, 3.2, 8.6], fov: 48 }} dpr={compact ? [1, 1.25] : [1, 1.7]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
    <Scene onSelect={onSelect} compact={compact} />
  </Canvas>
}