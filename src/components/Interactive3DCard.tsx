import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { soundFX } from '../utils/soundFx';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glareColor?: string;
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({
  children,
  className = '',
  onClick,
  glareColor = 'rgba(16, 185, 129, 0.15)',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [6, -6]), { stiffness: 400, damping: 28 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-6, 6]), { stiffness: 400, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;
    x.set(mouseX);
    y.set(mouseY);
    
    // Direct CSS variable updates for 60fps zero-react-render glare
    cardRef.current.style.setProperty('--glare-x', `${(mouseX * 100).toFixed(1)}%`);
    cardRef.current.style.setProperty('--glare-y', `${(mouseY * 100).toFixed(1)}%`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundFX.playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
        willChange: isHovered ? 'transform' : 'auto',
      }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.15 }}
      className={`relative transition-all duration-150 group ${className}`}
    >
      {/* 3D Content Container */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* Dynamic Cursor-following Glare Sheen using CSS Custom Properties */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-20 overflow-hidden transition-opacity duration-150"
          style={{
            background: `radial-gradient(circle 240px at var(--glare-x, 50%) var(--glare-y, 50%), ${glareColor} 0%, rgba(6, 182, 212, 0.06) 40%, transparent 80%)`,
          }}
        />
      )}
    </motion.div>
  );
};
