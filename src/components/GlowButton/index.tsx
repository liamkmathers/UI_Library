import { motion } from 'framer-motion';
import { useState } from 'react';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function GlowButton({ 
  children, 
  onClick,
  className = "" 
}: GlowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={`
        relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 
        text-white font-semibold rounded-lg overflow-hidden
        transition-all duration-300 ease-out
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0"
        animate={{
          opacity: isHovered ? 0.3 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        animate={{
          x: isHovered ? "100%" : "-100%",
          opacity: isHovered ? [0, 0.3, 0] : 0,
        }}
        transition={{ 
          duration: 0.6,
          ease: "easeInOut"
        }}
      />
      
      {/* Button content */}
      <span className="relative z-10">{children}</span>
      
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-0"
        animate={{
          opacity: isHovered ? 0.7 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ zIndex: -1 }}
      />
    </motion.button>
  );
} 