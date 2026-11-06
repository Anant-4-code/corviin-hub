import React from 'react';
import { HardDrive, Shield, FileText, Check } from 'lucide-react';
import type { WorkspaceSettings } from '@corviin-hub/shared';

interface WorkspaceStorageSectionProps {
  settings: WorkspaceSettings;
}

export const WorkspaceStorageSection: React.FC<WorkspaceStorageSectionProps> = ({ settings }) => {
  const { storageConfig } = settings;

  const usedMB = (storageConfig.usedBytes / (1024 * 1024)).toFixed(1);
  const usedGB = (storageConfig.usedBytes / (1024 * 1024 * 1024)).toFixed(2);
  const maxGB = (storageConfig.maxBytes / (1024 * 1024 * 1024)).toFixed(0);
  const maxUploadMB = (storageConfig.maxUploadFileBytes / (1024 * 1024)).toFixed(0);
  const percentUsed = Math.min(
    100,
    Math.round((storageConfig.usedBytes / storageConfig.maxBytes) * 100),
  );

  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-primary">Workspace Storage & Quota</h2>
        <p className="text-xs text-secondary mt-0.5">
          Object storage allocation, upload limits, deduplication rules, and file retention policies.
        </p>
      </div>

      {/* Storage Meter Bar */}
      <div className="p-4 bg-surface-muted border border-border rounded-md space-y-3 max-w-2xl">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <HardDrive size={16} className="text-brand-teal" />
            <span className="font-semibold text-primary">Storage Allocation</span>
          </div>
          <span className="font-bold text-primary">
            {usedGB} GB of {maxGB} GB ({percentUsed}%)
          </span>
        </div>

        {/* Static Progress Bar (Strictly Zero Animation) */}
        <div className="w-full bg-border rounded-full h-3 overflow-hidden">
          <div
            className="bg-brand-teal h-full"
            style={{ width: `${percentUsed}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-tertiary pt-1">
          <span>Used: {usedMB} MB</span>
          <span>Max Workspace Quota: {maxGB} GB</span>
        </div>
      </div>

      {/* Upload Policies and Limits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <div className="p-3.5 rounded-md bg-surface border border-border">
          <div className="text-xs font-semibold text-primary">Max File Upload Size</div>
          <div className="text-xl font-bold text-primary mt-1">{maxUploadMB} MB</div>
          <div className="text-[11px] text-secondary mt-1">
            Enforced at client uploader and API multipart boundary.
          </div>
        </div>

        <div className="p-3.5 rounded-md bg-surface border border-border">
          <div className="text-xs font-semibold text-primary">Storage Provider</div>
          <div className="text-sm font-bold text-primary mt-1">Cloudflare R2 / S3</div>
          <div className="text-[11px] text-secondary mt-1">
            Private encrypted bucket with presigned upload URLs.
          </div>
        </div>
      </div>

      {/* Allowed File Types */}
      <div className="space-y-2 max-w-2xl">
        <div className="text-xs font-semibold text-primary">Permitted File Types & Extensions</div>
        <div className="flex flex-wrap gap-1.5">
          {storageConfig.allowedExtensions.map((ext) => (
            <span
              key={ext}
              className="px-2.5 py-1 rounded text-xs font-medium bg-surface-muted border border-border text-primary flex items-center gap-1"
            >
              <FileText size={12} className="text-brand-teal" />
              <span>.{ext.toUpperCase()}</span>
            </span>
          ))}
        </div>
        <p className="text-[10px] text-tertiary">
          Executable files, shell scripts, and unsigned binaries are permanently blocked.
        </p>
      </div>

      {/* Administrative Policies (Read-Only) */}
      <div className="space-y-3 pt-2 border-t border-border max-w-2xl">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Shield size={15} className="text-brand-teal" />
          <span>Governance & Retention Rules (Read-Only)</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded bg-surface-muted border border-border flex items-start gap-2.5">
            <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold text-primary">Versioning Policy</div>
              <div className="text-secondary mt-0.5">{storageConfig.versioningPolicy}</div>
            </div>
          </div>

          <div className="p-3 rounded bg-surface-muted border border-border flex items-start gap-2.5">
            <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold text-primary">Retention & Compliance Hold</div>
              <div className="text-secondary mt-0.5">{storageConfig.retentionPolicy}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

