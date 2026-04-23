import React from 'react';

export const CapIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <defs>
      <linearGradient id="cap-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    
    {/* High-profile Crown with perspective */}
    <path 
      d="M3 14C3 9 7 4 12 4C17 4 21 9 21 14H3Z" 
      fill="url(#cap-grad)"
      className="text-teal-500"
    />
    
    {/* Structured Front Panel (Reinforced) */}
    <path 
      d="M12 4C9 4 6 7 5 14H19C18 7 15 4 12 4Z" 
      fill="white" 
      fillOpacity="0.1" 
    />
    
    {/* Premium Curved Visor (Bill) with depth */}
    <path 
      d="M21 14C21 14 22 14 23 15C24 16.5 22 18 12 18C2 18 0 16.5 1 15C2 14 3 14 3 14H21Z" 
      fill="currentColor"
      fillOpacity="0.9"
    />
    
    {/* Visor Shadow/Detail */}
    <path 
      d="M3 14.5C3 14.5 5 16.5 12 16.5C19 16.5 21 14.5 21 14.5" 
      stroke="black" 
      strokeOpacity="0.2" 
      strokeWidth="0.5"
    />
    
    {/* Top Button (Squatchee) */}
    <circle cx="12" cy="4" r="1.2" fill="white" fillOpacity="0.8" />
    
    {/* Premium Stitching Lines */}
    <path d="M12 4V14" stroke="white" strokeOpacity="0.15" strokeWidth="0.5" />
    <path d="M12 4C14.5 4.5 17.5 7.5 18.5 14" stroke="white" strokeOpacity="0.1" strokeWidth="0.5" />
    <path d="M12 4C9.5 4.5 6.5 7.5 5.5 14" stroke="white" strokeOpacity="0.1" strokeWidth="0.5" />
  </svg>
);
