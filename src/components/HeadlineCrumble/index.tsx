import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface HeadlineCrumbleProps {
  text?: string;
  className?: string;
}

interface LetterState {
  isFalling: boolean;
  randomRotation: number;
}

export default function HeadlineCrumble({ 
  text = "Hover to Crumble", 
  className = "" 
}: HeadlineCrumbleProps) {
  const letters = text.split('');
  const [letterStates, setLetterStates] = useState<LetterState[]>(
    letters.map(() => ({
      isFalling: false,
      randomRotation: Math.random() * 720 - 360
    }))
  );
  
  const timeoutRefs = useRef<{ [key: number]: number }>({});
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeout => window.clearTimeout(timeout));
    };
  }, []);
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const child = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotateZ: -20
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  const handleLetterHover = (index: number) => {
    setLetterStates(prev => {
      const newStates = [...prev];
      const letterState = newStates[index];
      
      // Only trigger if not already falling
      if (!letterState.isFalling) {
        newStates[index] = {
          ...letterState,
          isFalling: true,
          randomRotation: Math.random() * 720 - 360 // Generate new random rotation
        };
        
        // Reset letter after 5 seconds
        timeoutRefs.current[index] = window.setTimeout(() => {
          setLetterStates(prev => {
            const updatedStates = [...prev];
            updatedStates[index] = {
              ...updatedStates[index],
              isFalling: false
            };
            return updatedStates;
          });
        }, 5000); // 5 second total duration
      }
      
      return newStates;
    });
  };

  return (
    <motion.h1 
      className={`text-6xl font-bold text-white cursor-pointer select-none inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => {
        const letterState = letterStates[index];
        const bottomOfScreen = window.innerHeight - 100;
        const bounceHeight = bottomOfScreen - 30;
        
        const letterCrumbleVariants = {
          initial: { 
            y: 0, 
            opacity: 1,
            rotateZ: 0
          },
          crumble: {
            y: [0, bottomOfScreen, bounceHeight, bottomOfScreen],
            opacity: [1, 1, 1, 0],
            rotateZ: [0, letterState.randomRotation],
            transition: {
              duration: 4.5,
              times: [0, 0.7, 0.85, 1],
              ease: [0.55, 0.085, 0.68, 0.53],
              opacity: { delay: 4.0, duration: 0.5 }
            }
          }
        };

        return (
          <motion.span
            key={index}
            variants={letterState.isFalling ? letterCrumbleVariants : child}
            initial="initial"
            animate={letterState.isFalling ? "crumble" : "visible"}
            className={`inline-block transition-all duration-200 ${
              !letterState.isFalling 
                ? 'hover:cursor-pointer hover:scale-110 hover:text-red-400' 
                : 'cursor-default'
            }`}
            style={{ 
              display: 'inline-block',
              transformOrigin: 'center bottom',
              padding: '0 2px'
            }}
            onMouseEnter={() => handleLetterHover(index)}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        );
      })}
    </motion.h1>
  );
} 