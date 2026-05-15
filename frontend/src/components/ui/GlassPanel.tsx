import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export function GlassPanel({ children, className = "" }: GlassPanelProps) {
  return (
    <div className={`glass-panel rounded-lg ${className}`}>
      {children}
    </div>
  );
}
