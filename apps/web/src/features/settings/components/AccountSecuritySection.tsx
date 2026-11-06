import React from 'react';
import { ShieldCheck, Monitor, AlertTriangle } from 'lucide-react';
import type { AccountSecuritySummary } from '@corviin-hub/shared';

interface AccountSecuritySectionProps {
  securitySummary: AccountSecuritySummary;
}

export const AccountSecuritySection: React.FC<AccountSecuritySectionProps> = ({
  securitySummary,
}) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-primary">Account & Security Status</h2>
        <p className="text-xs text-secondary mt-0.5">
          Review active sessions, identity architecture boundaries, and platform security status.
        </p>
      </div>

      {/* Critical Architecture Boundary Notice */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
          <AlertTriangle size={16} />
          <span>Architecture Notice: Profile Switching vs. Authentication</span>
        </div>
        <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
          {securitySummary.identityNotice}
        </p>
        <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
          Functional password changes, OAuth/OIDC session termination, and multi-factor authentication are
          formally scheduled for Phase 4 (Persistence) and Phase 9 (Security & Release Readiness). In
          compliance with system requirements, placeholder password fields or fake security tokens are strictly omitted.
        </p>
      </div>

      {/* Active Device Session Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-primary">Active Device Sessions</h3>
          <span className="text-[11px] text-tertiary">
            {securitySummary.activeSessions.length} active connection
          </span>
        </div>

        <div className="space-y-2">
          {securitySummary.activeSessions.map((session) => (
            <div
              key={session.id}
              className="p-3.5 rounded-md bg-surface-muted border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-surface border border-border text-brand-teal">
                  <Monitor size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">{session.browser}</span>
                    {session.isCurrent && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        Current Session
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-secondary mt-0.5">
                    {session.os} • IP: {session.ipAddress}
                  </div>
                  <div className="text-[10px] text-tertiary">
                    Location: {session.location} • Last active: Just now
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-tertiary sm:text-right">
                <div>Provider: {securitySummary.authProvider}</div>
                <div>MFA: {securitySummary.mfaConfigured ? 'Enabled' : 'Not configured'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Principles & Policies */}
      <div className="space-y-2 pt-2 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Security & Privacy Policies</span>
        </div>
        <ul className="list-disc list-inside text-xs text-secondary space-y-1 pl-1">
          {securitySummary.securityNotices.map((notice, idx) => (
            <li key={idx} className="leading-relaxed">
              {notice}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

