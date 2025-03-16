import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width = 1200,
  height = 630,
  className,
  priority = false,
}: OptimizedImageProps) {
  // Check if the image is from an external source
  const isExternal = src.startsWith('http') || src.startsWith('https');
  
  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      {isExternal ? (
        // For external images
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="object-cover"
          unoptimized={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        // For local images
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
    </div>
  );
} 