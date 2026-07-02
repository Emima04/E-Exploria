import { motion } from "framer-motion";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        w-full
        py-3
        rounded-xl
        font-semibold
        text-lg
        text-cyan-300
        border
        border-cyan-400
        bg-cyan-500/10
        backdrop-blur-md
        hover:bg-cyan-500/20
        hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]
        transition-all
        duration-300
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

export default Button;