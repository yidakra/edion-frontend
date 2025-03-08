
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

const Logo = () => {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? "/white_on_trans.svg" : "/black_on_trans.svg";

  return (
    <motion.div 
      className="flex items-center justify-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="logo-container">
        <div className="flex items-center">
          <img 
            src={logoSrc} 
            alt="edion logo" 
            className="h-12 w-auto mr-2" 
          />
          <span className="text-4xl font-light tracking-wider">edion</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Logo;
