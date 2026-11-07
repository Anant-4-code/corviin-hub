import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowLeftRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { useAppStore } from '@/lib/store';
import { useProfiles } from '@/hooks/useProfiles';
import { cn } from '@/lib/cn';

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { selectedProfileId, setSelectedProfileId } = useAppStore();
  const { data: profiles } = useProfiles();
  const navigate = useNavigate();

  const activeProfile = profiles?.find((p) => p.id === selectedProfileId);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSwitch() {
    setSelectedProfileId(null);
    setOpen(false);
    navigate('/select-profile');
  }

  if (!activeProfile) return null;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-control hover:bg-surface-muted shrink-0"
        aria-label="Profile menu"
        aria-expanded={open}
      >
        <Avatar name={activeProfile.displayName} size="sm" />
        <span className="hidden sm:block text-sm font-medium text-ch-text-primary max-w-[100px] truncate">
          {activeProfile.displayName}
        </span>
        <ChevronDown size={12} className="hidden sm:block text-ch-text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-surface-elevated border border-ch-border rounded-lg shadow-lg z-50 py-1">
          <div className="px-3 py-2 border-b border-ch-border">
            <p className="text-sm font-semibold text-ch-text-primary">{activeProfile.displayName}</p>
            <p className="text-xs text-ch-text-muted mt-0.5">Acting profile selected</p>
          </div>
          <div className="p-2 border-b border-ch-border">
            <div className="flex items-start gap-2 px-2 py-1.5 rounded bg-warning/10 border border-warning/20">
              <AlertTriangle size={12} className="text-warning shrink-0 mt-0.5" />
              <p className="text-xs text-ch-text-secondary leading-snug">
                Shared-device profile selection — identity is not verified.
              </p>
            </div>
          </div>
          <div className="py-1">
            <button
              onClick={handleSwitch}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ch-text-primary hover:bg-surface-muted text-left"
            >
              <ArrowLeftRight size={14} className="text-ch-text-secondary" />
              Switch profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

