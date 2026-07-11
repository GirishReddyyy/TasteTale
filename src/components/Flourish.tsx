export function CornerFlourish({ className }: { className?: string }) {
  // A simple little strawberry/leaf flourish icon using the primary and supporting colors
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
        fill="var(--color-primary)" 
      />
      <path 
        d="M12 7c-1-1.5-2.5-2-4-2-1 0-2 .5-2 1.5 0 2 3 3 6 5 3-2 6-3 6-5 0-1-1-1.5-2-1.5-1.5 0-3 .5-4 2z" 
        fill="var(--color-supporting)" 
      />
    </svg>
  );
}
