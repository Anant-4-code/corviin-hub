import React, { useState, useEffect } from 'react';
import type { PersonalSettings, UpdatePersonalSettingsDto } from '@corviin-hub/shared';

interface PersonalProfileSectionProps {
  settings: PersonalSettings;
  onSave: (dto: UpdatePersonalSettingsDto) => Promise<void>;
  isSaving: boolean;
}

export const PersonalProfileSection: React.FC<PersonalProfileSectionProps> = ({
  settings,
  onSave,
  isSaving,
}) => {
  const [displayName, setDisplayName] = useState(settings.displayName);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [role, setRole] = useState(settings.role);
  const [bio, setBio] = useState(settings.bio || '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(settings.displayName);
    setEmail(settings.email);
    setPhone(settings.phone);
    setRole(settings.role);
    setBio(settings.bio || '');
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    try {
      await onSave({
        displayName: displayName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: role.trim(),
        bio: bio.trim(),
      });
      setStatusMessage('Personal profile updated successfully.');
    } catch {
      setStatusMessage('Failed to update personal profile. Please verify your inputs.');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-primary">Personal Profile</h2>
        <p className="text-xs text-secondary mt-0.5">
          Manage your display name, contact information, and professional bio.
        </p>
      </div>

      <div className="p-3 bg-surface-muted border border-border rounded-md text-xs text-secondary leading-relaxed">
        <strong>Historical Attribution Notice:</strong> Changing your display name updates future labels,
        mentions, and member directories. Historical task logs, completed deliverables, decisions, and
        stage transitions permanently retain their original recorded actor attribution.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="flex items-center gap-4 pb-2">
          <div className="w-14 h-14 rounded-full bg-brand-teal/20 text-brand-teal font-bold text-xl flex items-center justify-center border border-brand-teal/30">
            {settings.initials || settings.displayName.slice(0, 1)}
          </div>
          <div>
            <div className="text-sm font-bold text-primary">{settings.displayName}</div>
            <div className="text-xs text-secondary">{settings.role}</div>
            <div className="text-[11px] text-tertiary">ID: {settings.profileId}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Display Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Role / Position
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-primary mb-1">
            Bio / Operational Focus
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            placeholder="Brief description of responsibilities and focus areas..."
          />
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded text-xs border ${
              statusMessage.includes('successfully')
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border-rose-300 dark:border-rose-800'
            }`}
          >
            {statusMessage}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90 disabled:opacity-50 min-h-[44px]"
          >
            {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

