import Image from 'next/image';
import { resolveFileUrl } from '@/lib/api/client';

const OPTIMIZED_HOST = process.env.NEXT_PUBLIC_BACKEND_HOST;

type ConsoleImageProps = {
  src: string | null | undefined;
  alt: string;
  width: number;
  height: number;
  /** Rendered size hint for responsive images, e.g. "(min-width: 1024px) 33vw, 100vw". */
  sizes?: string;
  className?: string;
  priority?: boolean;
};

function isOptimizable(url: string): boolean {
  try {
    const { protocol, hostname, pathname } = new URL(url);
    return protocol === 'https:' && hostname === OPTIMIZED_HOST && pathname.startsWith('/api/files/');
  } catch {
    return false;
  }
}

/**
 * An image from the DMV Console. Files hosted on the console are resized and
 * converted to AVIF/WebP by next/image; images from any other host (e.g. a
 * banner linked from a stock-photo site) fall back to a lazy plain <img>.
 */
export function ConsoleImage({ src, alt, width, height, sizes, className, priority = false }: ConsoleImageProps) {
  const url = resolveFileUrl(src);
  if (!url) return null;

  if (isOptimizable(url)) {
    return <Image src={url} alt={alt} width={width} height={height} sizes={sizes ?? `${width}px`} className={className} priority={priority} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} width={width} height={height} loading={priority ? 'eager' : 'lazy'} decoding="async" className={className} />;
}
