import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CurrencyBill = () => {
  const meshRef = useRef();
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Currency bill texture
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Dark green gradient background (like a bill)
    const gradient = ctx.createLinearGradient(0, 0, 512, 256);
    gradient.addColorStop(0, '#0a1f0a');
    gradient.addColorStop(0.5, '#143314');
    gradient.addColorStop(1, '#0a1f0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 256);
    
    // Add subtle pattern
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 512; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 256);
      ctx.stroke();
    }
    for (let i = 0; i < 256; i += 8) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
    
    // Gold border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 492, 236);
    
    // Inner border
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 472, 216);
    
    // Main symbol (centered)
    ctx.font = 'bold 100px serif';
    ctx.fillStyle = '#D4AF37';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FF', 256, 128);
    
    // Small currency symbols in corners
    ctx.font = 'bold 24px serif';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.fillText('$', 50, 50);
    ctx.fillText('€', 462, 50);
    ctx.fillText('£', 50, 206);
    ctx.fillText('¥', 462, 206);
    
    // Decorative text
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.fillText('FOUNDER FUND', 256, 220);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      // Gentle rotation based on time and scroll
      meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.3 + scrollY * 0.0005;
      meshRef.current.rotation.x = Math.cos(time * 0.2) * 0.1;
      meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.05;
      // Gentle floating motion
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.15;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh scale={[2.5, 1.25, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      {/* Glow effect */}
      <mesh scale={[2.6, 1.35, 0.01]} position={[0, 0, -0.02]}>
        <planeGeometry />
        <meshBasicMaterial 
          color="#D4AF37" 
          transparent 
          opacity={0.05}
        />
      </mesh>
    </group>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#D4AF37" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ffffff" />
      <spotLight
        position={[0, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#D4AF37"
      />
      <CurrencyBill />
    </>
  );
};

export const CurrencyCanvas = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default CurrencyCanvas;
