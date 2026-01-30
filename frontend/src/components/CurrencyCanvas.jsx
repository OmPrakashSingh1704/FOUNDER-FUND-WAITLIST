import { useEffect, useState, useRef } from 'react';

export const CurrencyCanvas = ({ className = '' }) => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate rotation based on scroll
  const rotateY = (scrollY * 0.05) % 360;
  const rotateX = Math.sin(scrollY * 0.002) * 10;

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Ambient glow */}
      <div 
        className="absolute top-1/2 left-1/2 w-[600px] h-[400px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      
      {/* 3D Currency Bill */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            rotateY(${rotateY + 15}deg) 
            rotateX(${rotateX}deg) 
            translateZ(50px)
          `,
          animation: 'float 6s ease-in-out infinite',
        }}
      >
        {/* Bill front face */}
        <div 
          className="relative w-[400px] h-[200px] rounded-sm overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0a1f0a 0%, #143314 50%, #0a1f0a 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px -20px rgba(212, 175, 55, 0.2)',
            border: '3px solid #D4AF37',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                linear-gradient(180deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '15px 15px',
            }}
          />
          
          {/* Inner border */}
          <div 
            className="absolute inset-3 border border-gold/30 rounded-sm"
          />
          
          {/* Currency symbols in corners */}
          <div className="absolute top-4 left-4 text-gold/50 font-serif text-2xl font-bold">$</div>
          <div className="absolute top-4 right-4 text-gold/50 font-serif text-2xl font-bold">€</div>
          <div className="absolute bottom-4 left-4 text-gold/50 font-serif text-2xl font-bold">£</div>
          <div className="absolute bottom-4 right-4 text-gold/50 font-serif text-2xl font-bold">¥</div>
          
          {/* Center emblem */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div 
                className="text-gold font-display text-6xl font-semibold tracking-tight"
                style={{
                  textShadow: '0 0 30px rgba(212, 175, 55, 0.5)',
                }}
              >
                FF
              </div>
            </div>
          </div>
          
          {/* Bottom text */}
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <span className="text-gold/40 text-[10px] tracking-[0.3em] uppercase font-body">
              Founder Fund
            </span>
          </div>
          
          {/* Shine effect */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
              animation: 'shimmer 4s ease-in-out infinite',
            }}
          />
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animation: `float ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(5px); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default CurrencyCanvas;
