'use client';

interface HamburgerIconProps {
  isOpen: boolean;
  className?: string;
}

export default function HamburgerIcon({
  isOpen,
  className = '',
}: HamburgerIconProps) {
  return (
    <svg
      className={`h-6 w-6 stroke-current ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {isOpen ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  );
}
