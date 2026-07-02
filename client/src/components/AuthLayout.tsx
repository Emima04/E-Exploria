import { ReactNode } from "react";
import background from "../assets/images/home/hero-background.avif";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <img
        src={background}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Cyan Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/60 via-black/40 to-black/70" />

      {/* Page Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-5">
        {children}
      </div>
    </div>
  );
}