import React from 'react';

interface GlassmorphismProps {
  children: React.ReactNode;
  className?: string;
  lightAngle?: number;
  intensity?: number;
  refraction?: number;
  depth?: number;
  frost?: number;
  dropShadow?: {
    x?: number;
    y?: number;
    blur?: number;
    spread?: number;
    color?: string;
    opacity?: number;
  };
  backgroundColor?: {
    color?: string;
    opacity?: number;
  };
}

export default function Glassmorphism({
  children,
  className = '',
  lightAngle = -45,
  intensity = 70,
  refraction = 120,
  depth = 40,
  frost = 12,
  dropShadow = {
    x: 4,
    y: 4,
    blur: 16,
    spread: 0,
    color: '000000',
    opacity: 10,
  },
  backgroundColor = {
    color: 'FDFBF7',
    opacity: 1,
  },
}: GlassmorphismProps) {
  const shadowStyle = `${dropShadow.x}px ${dropShadow.y}px ${dropShadow.blur}px ${dropShadow.spread}px #${dropShadow.color}${Math.round(
    (dropShadow.opacity! / 100) * 255
  )
    .toString(16)
    .padStart(2, '0')}`;

  const glassStyle: React.CSSProperties = {
    backgroundColor: `#${backgroundColor.color}${Math.round(
      (backgroundColor.opacity! / 100) * 255
    )
      .toString(16)
      .padStart(2, '0')}`,
    backdropFilter: `blur(${frost}px) saturate(${intensity}%)`,
    WebkitBackdropFilter: `blur(${frost}px) saturate(${intensity}%)`,
    border: `1px solid rgba(255, 255, 255, ${0.1 + intensity / 1000})`,
    boxShadow: shadowStyle,
    position: 'relative' as const,
    overflow: 'hidden',
  };

  // Light reflection overlay that follows the light angle
  const lightReflectionStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(${lightAngle}deg, 
      rgba(255, 255, 255, ${(intensity / 100) * 0.3}) 0%, 
      rgba(255, 255, 255, ${(intensity / 100) * 0.1}) 20%, 
      rgba(255, 255, 255, 0.05) 40%, 
      rgba(255, 255, 255, 0) 60%, 
      rgba(255, 255, 255, 0) 100%)`,
    borderRadius: 'inherit',
    pointerEvents: 'none' as const,
    zIndex: 1,
  };

  // Subtle surface refraction overlay
  const refractionOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(${lightAngle + 90}deg, 
      rgba(255, 255, 255, ${refraction / 2000}) 0%, 
      rgba(255, 255, 255, ${depth / 2000}) 50%, 
      rgba(255, 255, 255, ${refraction / 3000}) 100%)`,
    borderRadius: 'inherit',
    pointerEvents: 'none' as const,
    zIndex: 2,
  };

  // Edge highlight for the liquid glass effect
  const edgeHighlightStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `conic-gradient(from ${lightAngle}deg, 
      rgba(255, 255, 255, ${(intensity / 100) * 0.8}) 0deg, 
      rgba(255, 255, 255, 0) 90deg, 
      rgba(255, 255, 255, 0) 180deg, 
      rgba(255, 255, 255, ${(intensity / 100) * 0.1}) 270deg, 
      rgba(255, 255, 255, ${(intensity / 100) * 0.8}) 360deg)`,
    borderRadius: 'inherit',
    pointerEvents: 'none' as const,
    zIndex: 3,
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMask:
      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'xor',
    WebkitMaskComposite: 'xor',
    padding: '1px',
  };

  return (
    <div className={`relative ${className}`} style={glassStyle}>
      {/* Light reflection overlay */}
      <div style={lightReflectionStyle} />
      {/* Surface refraction overlay */}
      <div style={refractionOverlayStyle} />
      {/* Edge highlight for liquid glass effect */}
      <div style={edgeHighlightStyle} />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
