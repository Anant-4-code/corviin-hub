import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Info, AlertTriangle, RefreshCw, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { useProfiles } from '@/hooks/useProfiles';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useAppStore } from '@/lib/store';
import { ThemeSwitcher } from '@/components/navigation/ThemeSwitcher';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import type { Profile } from '@corviin-hub/shared';

export function SelectProfilePage() {
  const navigate = useNavigate();
  const { data: profiles, isLoading, isError, error, refetch, isFetching } = useProfiles();
  const { data: workspaces } = useWorkspaces();
  
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);
  const setSelectedProfileId = useAppStore((s) => s.setSelectedProfileId);
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const setSelectedWorkspaceId = useAppStore((s) => s.setSelectedWorkspaceId);

  // Active selection state on this screen (pre-select if already chosen in store)
  const [selectedId, setSelectedId] = useState<string | null>(selectedProfileId || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // When profiles load, if previously selected ID is invalid, reset it
  React.useEffect(() => {
    if (profiles && selectedId) {
      const exists = profiles.some((p) => p.id === selectedId);
      if (!exists && profiles.length > 0) {
        setSelectedId(null);
      }
    }
  }, [profiles, selectedId]);

  const handleSelectCard = (profileId: string) => {
    setSelectedId(profileId);
    setSubmitError(null);
  };

  const handleKeyDownCard = (e: React.KeyboardEvent, profileId: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleSelectCard(profileId);
    }
  };

  const handleContinue = () => {
    if (!selectedId) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      setSelectedProfileId(selectedId);
      
      // Auto-select first workspace if none is active
      if (!selectedWorkspaceId && workspaces && workspaces.length > 0) {
        setSelectedWorkspaceId(workspaces[0].id);
      }
      
      navigate('/app/dashboard');
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to set active profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FD] dark:bg-[#0C1424] text-[#172B4D] dark:text-[#F1F5F9] transition-none selection:bg-[#DBEAFE] dark:selection:bg-[#1E3A5F]">
      {/* =========================================================================
          HEADER (Step 3A)
          Desktop: Brand left, Theme toggle right, max width container
          Mobile: Compact header, visible brand and reachable theme toggle
      ========================================================================= */}
      <header className="w-full border-b border-[#DCE4F0] dark:border-[#2B3B54] bg-[#FFFFFF] dark:bg-[#17243A] sticky top-0 z-20 transition-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#2563EB] dark:bg-[#60A5FA] text-white dark:text-[#0C1424] font-bold text-sm tracking-wider select-none shadow-sm">
              CH
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-[#172B4D] dark:text-[#F1F5F9] leading-tight">
                CORVIIN HUB
              </span>
              <span className="text-[11px] font-medium text-[#52627A] dark:text-[#A9B8CE] hidden sm:inline leading-none mt-0.5">
                Internal Operations Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#52627A] dark:text-[#A9B8CE] hidden md:inline mr-1">
              Theme
            </span>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN SECTION (Step 3B & 4/5/6)
      ========================================================================= */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full max-w-5xl mx-auto">
        <div className="w-full text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DBEAFE] dark:bg-[#1E3A5F] text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={13} className="text-[#EAB308] dark:text-[#FACC15]" />
            Acting Profile Selection
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172B4D] dark:text-[#F1F5F9]">
            Choose your profile
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#52627A] dark:text-[#A9B8CE] max-w-md mx-auto">
            Select your profile to continue to CORVIIN HUB.
          </p>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="w-full max-w-2xl py-12 px-6 flex flex-col items-center justify-center text-center bg-[#FFFFFF] dark:bg-[#17243A] border border-[#DCE4F0] dark:border-[#2B3B54] rounded-2xl shadow-sm">
            <RefreshCw size={28} className="text-[#2563EB] dark:text-[#60A5FA] animate-spin mb-3" />
            <p className="text-sm font-semibold text-[#172B4D] dark:text-[#F1F5F9]">
              Loading team profiles…
            </p>
            <p className="text-xs text-[#78879C] dark:text-[#8293AA] mt-1">
              Connecting to internal API service
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {isError && (
          <div className="w-full max-w-md p-6 bg-[#FFFFFF] dark:bg-[#17243A] border border-rose-300 dark:border-rose-900/60 rounded-2xl shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-[#172B4D] dark:text-[#F1F5F9]">
              Could not load profiles
            </h3>
            <p className="text-xs sm:text-sm text-[#52627A] dark:text-[#A9B8CE] mt-1.5 leading-relaxed">
              Unable to connect to the CORVIIN HUB server. Make sure the API service is online.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold"
            >
              <RefreshCw size={13} className={cn(isFetching && 'animate-spin')} />
              Retry request
            </Button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !isError && profiles && profiles.length === 0 && (
          <div className="w-full max-w-md p-8 bg-[#FFFFFF] dark:bg-[#17243A] border border-[#DCE4F0] dark:border-[#2B3B54] rounded-2xl shadow-sm text-center">
            <Info size={32} className="text-[#78879C] dark:text-[#8293AA] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#172B4D] dark:text-[#F1F5F9]">
              No profiles are available.
            </h3>
            <p className="text-xs sm:text-sm text-[#52627A] dark:text-[#A9B8CE] mt-1.5">
              No registered profiles were found in the current environment. Please contact your workspace administrator.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-4 text-xs font-semibold"
            >
              Check again
            </Button>
          </div>
        )}

        {/* PROFILES GRID (Step 3C, 4, 5, 6) */}
        {!isLoading && !isError && profiles && profiles.length > 0 && (
          <div className="w-full max-w-4xl flex flex-col items-center">
            <div
              role="radiogroup"
              aria-label="Select your acting profile"
              className={cn(
                'w-full grid gap-4 sm:gap-5',
                // Responsive Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop
                profiles.length === 1 && 'grid-cols-1 max-w-sm',
                profiles.length === 2 && 'grid-cols-1 sm:grid-cols-2 max-w-xl',
                profiles.length >= 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              )}
            >
              {profiles.map((profile: Profile) => {
                const isSelected = selectedId === profile.id;
                return (
                  <div
                    key={profile.id}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => handleSelectCard(profile.id)}
                    onKeyDown={(e) => handleKeyDownCard(e, profile.id)}
                    className={cn(
                      'group relative flex items-center sm:items-start p-4 sm:p-5 rounded-xl border text-left cursor-pointer transition-none select-none outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] dark:focus-visible:ring-[#60A5FA]',
                      isSelected
                        ? 'bg-[#EEF3FA] dark:bg-[#1D2D46] border-[#2563EB] dark:border-[#60A5FA] ring-1 ring-[#2563EB] dark:ring-[#60A5FA] shadow-sm'
                        : 'bg-[#FFFFFF] dark:bg-[#17243A] border-[#DCE4F0] dark:border-[#2B3B54] hover:bg-[#EEF3FA]/60 dark:hover:bg-[#1D2D46]/60 hover:border-[#2563EB]/40 dark:hover:border-[#60A5FA]/40'
                    )}
                  >
                    {/* Member Avatar */}
                    <div className="relative shrink-0 mr-3.5 sm:mr-4">
                      <Avatar
                        name={profile.displayName}
                        imageUrl={profile.avatarUrl}
                        size="lg"
                        className={cn(
                          'w-12 h-12 sm:w-14 sm:h-14 text-base font-bold rounded-xl border transition-none',
                          isSelected
                            ? 'border-[#2563EB] dark:border-[#60A5FA] bg-[#2563EB] text-white dark:bg-[#60A5FA] dark:text-[#0C1424]'
                            : 'border-[#DCE4F0] dark:border-[#2B3B54] bg-[#DBEAFE] text-[#2563EB] dark:bg-[#1E3A5F] dark:text-[#60A5FA]'
                        )}
                      />
                      {/* Active Yellow Accent Tag */}
                      {isSelected && (
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EAB308] dark:bg-[#FACC15] ring-2 ring-white dark:ring-[#17243A]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#172B4D] dark:bg-[#0C1424]" />
                        </span>
                      )}
                    </div>

                    {/* Member Details */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-[#172B4D] dark:text-[#F1F5F9] truncate">
                          {profile.displayName}
                        </span>
                      </div>
                      <p className="text-xs text-[#52627A] dark:text-[#A9B8CE] mt-0.5 truncate">
                        {profile.email || 'Team Member'}
                      </p>
                      <div className="mt-2.5 flex items-center gap-1.5">
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold transition-none',
                            isSelected
                              ? 'bg-[#2563EB]/10 dark:bg-[#60A5FA]/20 text-[#2563EB] dark:text-[#60A5FA]'
                              : 'bg-[#EEF3FA] dark:bg-[#1D2D46] text-[#78879C] dark:text-[#8293AA]'
                          )}
                        >
                          {isSelected ? 'Active Selection' : 'Click to select'}
                        </span>
                      </div>
                    </div>

                    {/* Custom Radio / Check Indicator */}
                    <div
                      className={cn(
                        'absolute top-4 right-4 sm:top-5 sm:right-5 w-5 h-5 rounded-full border flex items-center justify-center transition-none',
                        isSelected
                          ? 'border-[#2563EB] dark:border-[#60A5FA] bg-[#2563EB] dark:bg-[#60A5FA] text-white dark:text-[#0C1424]'
                          : 'border-[#DCE4F0] dark:border-[#2B3B54] bg-[#FFFFFF] dark:bg-[#17243A] text-transparent'
                      )}
                    >
                      <Check size={12} strokeWidth={3} className={cn(!isSelected && 'opacity-0')} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CONTINUE ACTION BUTTON (Step 3D) */}
            <div className="mt-8 sm:mt-10 w-full max-w-sm flex flex-col items-center">
              <button
                type="button"
                onClick={handleContinue}
                disabled={!selectedId || isSubmitting}
                className={cn(
                  'w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-none shadow-sm cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  selectedId && !isSubmitting
                    ? 'bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#60A5FA] dark:hover:bg-[#93C5FD] text-white dark:text-[#0C1424] focus-visible:ring-[#2563EB]'
                    : 'bg-[#DCE4F0] dark:bg-[#2B3B54] text-[#78879C] dark:text-[#8293AA] cursor-not-allowed'
                )}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Entering CORVIIN HUB…</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Submit Error banner if any */}
              {submitError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-2 text-center font-medium">
                  {submitError}
                </p>
              )}
            </div>

            {/* IDENTITY LIMITATION NOTICE (Step 3E) */}
            <div className="mt-8 w-full max-w-lg flex items-start gap-3 p-3.5 bg-[#FEF3C7]/60 dark:bg-[#493B13]/30 border border-[#EAB308]/40 dark:border-[#FACC15]/30 rounded-xl">
              <ShieldAlert size={16} className="text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-[#52627A] dark:text-[#A9B8CE]">
                <strong className="text-[#172B4D] dark:text-[#F1F5F9] font-semibold">
                  Profile selection does not verify identity.
                </strong>{' '}
                This device will operate as the chosen profile for auditing, activity tracking, and task ownership within the internal workspace.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full py-4 border-t border-[#DCE4F0] dark:border-[#2B3B54] text-center text-xs text-[#78879C] dark:text-[#8293AA]">
        <span>CORVIIN HUB</span> &bull; <span>Internal Prototype Operations</span>
      </footer>
    </div>
  );
}
