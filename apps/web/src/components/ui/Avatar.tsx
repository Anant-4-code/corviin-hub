import { cn } from '@/lib/cn';

type Size = 'xs' | 'sm' | 'md' | 'lg';

interface AvatarProps { name: string; imageUrl?: string; size?: Size; className?: string; }

const sizeClasses: Record<Size, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
};

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function Avatar({ name, imageUrl, size = 'md', className }: AvatarProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn('rounded-full object-cover shrink-0', sizeClasses[size], className)}
      />
    );
  }
  return (
    <span
      aria-label={name}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold shrink-0',
        sizeClasses[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}

