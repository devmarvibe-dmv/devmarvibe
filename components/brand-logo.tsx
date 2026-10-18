import Image from 'next/image';
import logo from '@/public/Main_Logo.png';
import logoWhite from '@/public/Mainlogo_white.png';

/** The DevMarVibe logo, sized by height. Pass `priority` for the logo above the fold. */
export function BrandLogo({ light = false, height = 100, priority = false, className = '' }: { light?: boolean; height?: number; priority?: boolean; className?: string }) {
  const source = light ? logoWhite : logo;
  const width = Math.round((source.width / source.height) * height);
  return <Image
    src={source}
    alt="DevMarVibe"
    width={width}
    height={height}
    priority={priority}
    sizes={`${width}px`}
    className={`w-auto object-contain ${className}`}
    style={{ height }}
  />;
}
