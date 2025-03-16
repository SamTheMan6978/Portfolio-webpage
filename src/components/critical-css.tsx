// Critical CSS component that inlines essential styles
// This helps eliminate render blocking CSS

'use client';

import { useEffect, useState } from 'react';

// Critical CSS for above-the-fold content
const criticalStyles = `
  /* Basic resets and typography */
  body {
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  
  /* Critical layout styles */
  .max-w-2xl {
    max-width: 42rem;
  }
  
  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }
  
  .flex {
    display: flex;
  }
  
  .flex-col {
    flex-direction: column;
  }
  
  .min-h-\\[100dvh\\] {
    min-height: 100dvh;
  }
  
  .space-y-10 > * + * {
    margin-top: 2.5rem;
  }
  
  /* Dark mode base styling */
  .dark {
    color-scheme: dark;
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;
  }
`;

// Component to add critical CSS and defer non-critical CSS
export function CriticalCSS() {
  // Use state to avoid React hydration mismatch
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Load non-critical CSS after page load
    const loadNonCriticalCSS = () => {
      const links = document.querySelectorAll('link[data-critical="false"]');
      links.forEach(link => {
        link.setAttribute('media', 'all');
      });
    };

    // Check if the document is already complete or use load event
    if (document.readyState === 'complete') {
      loadNonCriticalCSS();
    } else {
      window.addEventListener('load', loadNonCriticalCSS);
      return () => window.removeEventListener('load', loadNonCriticalCSS);
    }
  }, []);

  // Only render the style tag on the client side to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <style 
      dangerouslySetInnerHTML={{ __html: criticalStyles }} 
      data-critical="true"
    />
  );
} 