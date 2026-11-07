import React, { useState } from 'react';
import { MemberStatus } from '@corviin-hub/shared';
import type { CreateTeamMemberDto } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';

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
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Add Team Member"
      subtitle="Add a new member to the directory and assign workspace responsibilities."
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
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

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@corviin.com"
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>
        </div>

        {/* Workspace assignments */}
        <div>
          <label className="block text-xs font-semibold text-primary mb-1.5">
            Workspace Assignments <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ws-tech-0001-0000-000000000001', label: 'Corviin Tech' },
              { id: 'ws-real-0002-0000-000000000002', label: 'Corviin Real Estate' },
            ].map((ws) => {
              const active = selectedWorkspaces.includes(ws.id);
              return (
                <button
                  type="button"
                  key={ws.id}
                  onClick={() => handleToggleWorkspace(ws.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border ${
                    active
                      ? 'bg-brand-teal/15 text-brand-teal border-brand-teal'
                      : 'bg-surface text-secondary border-border hover:bg-surface-hover'
                  }`}
                >
                  {ws.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-primary mb-1">Initial Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MemberStatus)}
            className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
          >
            <option value={MemberStatus.ACTIVE}>Active</option>
            <option value={MemberStatus.ON_LEAVE}>On Leave</option>
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
    </Dialog>
  );
};
