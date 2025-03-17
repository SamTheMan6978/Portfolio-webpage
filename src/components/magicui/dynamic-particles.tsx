"use client";

import dynamic from 'next/dynamic';
import { ComponentPropsWithoutRef, Suspense } from 'react';

// Dynamically import the Particles component to avoid it blocking the main render
const DynamicParticles = dynamic(() => import('./particles').then(mod => ({ default: mod.Particles })), {
  ssr: false, // Don't render on the server
  loading: () => <ParticlesPlaceholder />
});

// Type definition for the Particles component props
interface ParticlesProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

// Simple placeholder to prevent layout shift
function ParticlesPlaceholder() {
  return <div className="absolute inset-0 h-full w-full" />;
}

// Export the dynamically loaded component
export function LazyParticles(props: ParticlesProps) {
  return (
    <Suspense fallback={<ParticlesPlaceholder />}>
      <DynamicParticles {...props} />
    </Suspense>
  );
} 