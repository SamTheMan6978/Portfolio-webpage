import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  quality?: number;
}

export default function OptimizedImage({
  src,
  alt,
  width = 1200,
  height = 630,
  className,
  priority = false,
  loading = 'lazy',
  quality = 75, // Default quality set to 75 for better performance
}: OptimizedImageProps) {
  // Check if the image is from an external source
  const isExternal = src.startsWith('http') || src.startsWith('https');
  
  // More granular sizes for better responsive loading
  const imageSizes = '(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 50vw';
  
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
          loading={loading}
          quality={quality}
          className="object-cover"
          unoptimized={false}
          sizes={imageSizes}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        />
      ) : (
        // For local images
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          loading={loading}
          quality={quality}
          className="object-cover"
          sizes={imageSizes}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        />
      )}
    </div>
  );
} 