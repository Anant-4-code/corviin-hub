import React, { useState } from 'react';
import { MemberStatus } from '@corviin-hub/shared';
import type { CreateTeamMemberDto } from '@corviin-hub/shared';

interface AddMemberDialogProps {
  isOpen: boolean;
  defaultWorkspaceId: string;
  onClose: () => void;
  onSubmit: (dto: CreateTeamMemberDto) => Promise<void>;
}

export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  isOpen,
  defaultWorkspaceId,
  onClose,
  onSubmit,
}) => {
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState<MemberStatus>(MemberStatus.ACTIVE);
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>([defaultWorkspaceId]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleWorkspace = (wsId: string) => {
    setSelectedWorkspaces((prev) =>
      prev.includes(wsId) ? prev.filter((id) => id !== wsId) : [...prev, wsId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError('Member display name is required.');
      return;
    }
    if (!role.trim()) {
      setError('Member role is required.');
      return;
    }
    if (selectedWorkspaces.length === 0) {
      setError('At least one workspace must be selected.');
      return;
    }

    const dto: CreateTeamMemberDto = {
      displayName: displayName.trim(),
      role: role.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      bio: bio.trim() || undefined,
      workspaceIds: selectedWorkspaces,
      status,
    };

    try {
      setIsSubmitting(true);
      await onSubmit(dto);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add member.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
      <div className="bg-surface border border-border rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-muted/30">
          <div>
            <h2 className="text-base font-semibold text-primary">Add Team Member</h2>
            <p className="text-xs text-secondary mt-0.5">
              Add a new member to the directory and assign workspace responsibilities.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-tertiary hover:text-primary p-1 rounded-md"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 text-xs bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-md">
              {error}
            </div>
          )}

          {/* Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Display Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Priya Sundaram"
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Role / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Growth Marketing Lead"
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@corviin.tech"
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91-98765-43210"
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
          </div>

          {/* Workspace Assignment Checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">
              Assigned Workspaces <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              <label className="flex items-center gap-2 p-2.5 rounded border border-border bg-surface-muted text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedWorkspaces.includes('ws-tech-0001-0000-000000000001')}
                  onChange={() => handleToggleWorkspace('ws-tech-0001-0000-000000000001')}
                  className="rounded text-brand-teal focus:ring-brand-teal"
                />
                <span className="font-medium text-primary">Corviin Tech</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded border border-border bg-surface-muted text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedWorkspaces.includes('ws-real-0002-0000-000000000002')}
                  onChange={() => handleToggleWorkspace('ws-real-0002-0000-000000000002')}
                  className="rounded text-brand-teal focus:ring-brand-teal"
                />
                <span className="font-medium text-primary">Corviin Real Estate</span>
              </label>
            </div>
          </div>

          {/* Initial Status */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as MemberStatus)}
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            >
              <option value={MemberStatus.ACTIVE}>Active</option>
              <option value={MemberStatus.ON_LEAVE}>On Leave</option>
              <option value={MemberStatus.AWAY}>Away</option>
              <option value={MemberStatus.INACTIVE}>Inactive</option>
            </select>
          </div>

          {/* Bio / Responsibilities */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Responsibilities & Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Outline specific responsibilities, focus areas, and skill specializations..."
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-secondary hover:text-primary bg-surface border border-border rounded-md hover:bg-surface-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-md bg-brand-teal text-white hover:bg-brand-teal/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Team Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

