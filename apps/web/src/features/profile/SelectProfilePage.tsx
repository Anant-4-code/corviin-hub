import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useProfiles } from '@/hooks/useProfiles';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useAppStore } from '@/lib/store';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingState, ErrorState } from '@/components/ui/States';
import type { Profile } from '@corviin-hub/shared';

export function SelectProfilePage() {
  const navigate = useNavigate();
  const { data: profiles, isLoading, error, refetch } = useProfiles();
  const { data: workspaces } = useWorkspaces();
  const { setSelectedProfileId, setSelectedWorkspaceId } = useAppStore();

  function handleSelectProfile(profile: Profile) {
    setSelectedProfileId(profile.id);
    // Auto-select first workspace if none selected
    if (workspaces && workspaces.length > 0) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
    navigate('/app/dashboard');
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6">
      {/* Logo / brand */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent text-accent-foreground font-bold text-xl mb-4">
          CH
        </div>
        <h1 className="text-2xl font-semibold text-ch-text-primary">CORVIIN HUB</h1>
        <p className="text-sm text-ch-text-secondary mt-1">Internal operations platform</p>
      </div>

      {/* Selection card */}
      <div className="w-full max-w-sm bg-surface border border-ch-border rounded-xl p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-ch-text-primary">Who is using CORVIIN HUB?</h2>
          <p className="text-sm text-ch-text-secondary mt-1">
            Select your profile to continue. This selects the active working profile on this device.
          </p>
        </div>

        {/* Profile list */}
        {isLoading && <LoadingState message="Loading profiles…" />}

        {error && (
          <ErrorState
            title="Could not load profiles"
            message="Unable to connect to the CORVIIN HUB server. Make sure the API is running."
            onRetry={() => refetch()}
          />
        )}

        {profiles && (
          <div className="flex flex-col gap-2">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleSelectProfile(profile)}
                className="flex items-center gap-3 p-3 rounded-lg border border-ch-border bg-surface hover:bg-surface-muted hover:border-accent text-left w-full group"
              >
                <Avatar name={profile.displayName} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ch-text-primary">{profile.displayName}</p>
                  <p className="text-xs text-ch-text-muted">Select this profile</p>
                </div>
                <ArrowRight size={16} className="text-ch-text-muted group-hover:text-accent" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Security notice */}
      <div className="mt-5 w-full max-w-sm flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
        <AlertTriangle size={14} className="text-warning shrink-0 mt-0.5" />
        <p className="text-xs text-ch-text-secondary leading-snug">
          <span className="font-medium text-ch-text-primary">Shared-device profile selection — identity is not verified.</span>{' '}
          This is an acting-profile selector for a trusted internal prototype, not secure authentication.
        </p>
      </div>
    </div>
  );
}

