import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import type { WorkspaceSettings, UpdateWorkspaceSettingsDto } from '@corviin-hub/shared';
import { checkImpact } from '@/services/settings';
import { ImpactWarningDialog } from './ImpactWarningDialog';

interface WorkspaceCrmSectionProps {
  settings: WorkspaceSettings;
  onSave: (dto: UpdateWorkspaceSettingsDto) => Promise<void>;
  isSaving: boolean;
}

export const WorkspaceCrmSection: React.FC<WorkspaceCrmSectionProps> = ({
  settings,
  onSave,
  isSaving,
}) => {
  const isTech = settings.businessType === 'TECHNOLOGY';

  // Tech CRM state
  const [techSources, setTechSources] = useState<string[]>(
    settings.crmConfig.techEnquirySources || [],
  );
  const [techCategories, setTechCategories] = useState<string[]>(
    settings.crmConfig.techServiceCategories || [],
  );

  // Real Estate CRM state
  const [partnerTypes, setPartnerTypes] = useState<string[]>(
    settings.crmConfig.partnerTypes || [],
  );
  const [buyerConfigs, setBuyerConfigs] = useState<string[]>(
    settings.crmConfig.buyerPropertyConfigs || [],
  );
  const [buyerSources, setBuyerSources] = useState<string[]>(
    settings.crmConfig.buyerLeadSources || [],
  );

  // New item inputs
  const [newTechSource, setNewTechSource] = useState('');
  const [newTechCategory, setNewTechCategory] = useState('');
  const [newPartnerType, setNewPartnerType] = useState('');
  const [newBuyerSource, setNewBuyerSource] = useState('');

  // Impact dialog state
  const [impactDialog, setImpactDialog] = useState<{
    isOpen: boolean;
    title: string;
    itemName: string;
    impactMessage: string;
    affectedCount: number;
    safeToRemove: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    itemName: '',
    impactMessage: '',
    affectedCount: 0,
    safeToRemove: true,
    onConfirm: () => {},
  });

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setTechSources(settings.crmConfig.techEnquirySources || []);
    setTechCategories(settings.crmConfig.techServiceCategories || []);
    setPartnerTypes(settings.crmConfig.partnerTypes || []);
    setBuyerConfigs(settings.crmConfig.buyerPropertyConfigs || []);
    setBuyerSources(settings.crmConfig.buyerLeadSources || []);
  }, [settings]);

  const handleAddTechSource = () => {
    if (!newTechSource.trim() || techSources.includes(newTechSource.trim())) return;
    setTechSources([...techSources, newTechSource.trim()]);
    setNewTechSource('');
  };

  const handleAddTechCategory = () => {
    if (!newTechCategory.trim() || techCategories.includes(newTechCategory.trim())) return;
    setTechCategories([...techCategories, newTechCategory.trim()]);
    setNewTechCategory('');
  };

  const handleAddPartnerType = () => {
    if (!newPartnerType.trim() || partnerTypes.includes(newPartnerType.trim())) return;
    setPartnerTypes([...partnerTypes, newPartnerType.trim()]);
    setNewPartnerType('');
  };

  const handleAddBuyerSource = () => {
    if (!newBuyerSource.trim() || buyerSources.includes(newBuyerSource.trim())) return;
    setBuyerSources([...buyerSources, newBuyerSource.trim()]);
    setNewBuyerSource('');
  };

  const promptRemoveItem = async (
    type: 'CRM_STAGE' | 'CRM_CATEGORY' | 'CRM_SOURCE' | 'PARTNER_TYPE',
    item: string,
    action: () => void,
  ) => {
    try {
      const res = await checkImpact(settings.workspaceId, type, item);
      setImpactDialog({
        isOpen: true,
        title: `Remove ${item}`,
        itemName: item,
        impactMessage: res.message,
        affectedCount: res.affectedCount,
        safeToRemove: res.safeToRemove,
        onConfirm: action,
      });
    } catch {
      action();
    }
  };

  const handleSave = async () => {
    setStatusMessage(null);
    try {
      if (isTech) {
        await onSave({
          crmConfig: {
            workspaceType: 'TECH',
            techEnquirySources: techSources,
            techServiceCategories: techCategories,
          },
        });
      } else {
        await onSave({
          crmConfig: {
            workspaceType: 'REAL_ESTATE',
            partnerTypes,
            buyerPropertyConfigs: buyerConfigs,
            buyerLeadSources: buyerSources,
          },
        });
      }
      setStatusMessage('CRM pipeline configuration saved successfully.');
    } catch {
      setStatusMessage('Failed to save CRM configuration.');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-primary">
          {isTech ? 'Corviin Tech CRM Configuration' : 'Corviin Real Estate CRM Configuration'}
        </h2>
        <p className="text-xs text-secondary mt-0.5">
          {isTech
            ? 'Manage technology client enquiry sources, software service categories, and quotation parameters.'
            : 'Configure developer partner types, buyer lead sources, and BHK configuration options.'}
        </p>
      </div>

      <div className="p-3 bg-surface-muted border border-border rounded-md text-xs text-secondary leading-relaxed">
        <strong>Consequential Safety Rule:</strong> Pipeline options (enquiry sources, partner types,
        categories) cannot be deleted without an automated dependency audit check. If active CRM records
        depend on an option, a consequential warning will require explicit review.
      </div>

      {isTech ? (
        /* TECH CRM CONFIGURATION */
        <div className="space-y-6 max-w-2xl">
          {/* Service Categories */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-primary">
              Software & Engineering Service Categories
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add service category (e.g. Mobile Apps)..."
                value={newTechCategory}
                onChange={(e) => setNewTechCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechCategory())}
                className="flex-1 text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
              />
              <button
                type="button"
                onClick={handleAddTechCategory}
                className="px-3 py-2 text-xs font-semibold rounded bg-surface-muted border border-border text-primary hover:bg-surface-hover flex items-center gap-1 min-h-[38px]"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="space-y-1.5 pt-1">
              {techCategories.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center justify-between p-2 rounded bg-surface-muted border border-border text-xs"
                >
                  <span className="font-medium text-primary">{cat}</span>
                  <button
                    type="button"
                    onClick={() =>
                      promptRemoveItem('CRM_CATEGORY', cat, () =>
                        setTechCategories(techCategories.filter((c) => c !== cat)),
                      )
                    }
                    className="text-secondary hover:text-rose-600 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
                    title="Remove category"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Enquiry Sources */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="block text-xs font-semibold text-primary">
              Tech Inbound & Lead Acquisition Sources
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add enquiry source (e.g. GitHub Sponsor)..."
                value={newTechSource}
                onChange={(e) => setNewTechSource(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechSource())}
                className="flex-1 text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
              />
              <button
                type="button"
                onClick={handleAddTechSource}
                className="px-3 py-2 text-xs font-semibold rounded bg-surface-muted border border-border text-primary hover:bg-surface-hover flex items-center gap-1 min-h-[38px]"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="space-y-1.5 pt-1">
              {techSources.map((src) => (
                <div
                  key={src}
                  className="flex items-center justify-between p-2 rounded bg-surface-muted border border-border text-xs"
                >
                  <span className="font-medium text-primary">{src}</span>
                  <button
                    type="button"
                    onClick={() =>
                      promptRemoveItem('CRM_SOURCE', src, () =>
                        setTechSources(techSources.filter((s) => s !== src)),
                      )
                    }
                    className="text-secondary hover:text-rose-600 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
                    title="Remove source"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* REAL ESTATE CRM CONFIGURATION */
        <div className="space-y-6 max-w-2xl">
          {/* Partner Types */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-primary">
              Real Estate Developer & Partner Types
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add partner type (e.g. Real Estate Fund)..."
                value={newPartnerType}
                onChange={(e) => setNewPartnerType(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPartnerType())}
                className="flex-1 text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
              />
              <button
                type="button"
                onClick={handleAddPartnerType}
                className="px-3 py-2 text-xs font-semibold rounded bg-surface-muted border border-border text-primary hover:bg-surface-hover flex items-center gap-1 min-h-[38px]"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="space-y-1.5 pt-1">
              {partnerTypes.map((pt) => (
                <div
                  key={pt}
                  className="flex items-center justify-between p-2 rounded bg-surface-muted border border-border text-xs"
                >
                  <span className="font-medium text-primary">{pt}</span>
                  <button
                    type="button"
                    onClick={() =>
                      promptRemoveItem('PARTNER_TYPE', pt, () =>
                        setPartnerTypes(partnerTypes.filter((p) => p !== pt)),
                      )
                    }
                    className="text-secondary hover:text-rose-600 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
                    title="Remove partner type"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Buyer Lead Sources */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="block text-xs font-semibold text-primary">
              Real Estate Buyer Lead Sources
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add lead source (e.g. Billboard)..."
                value={newBuyerSource}
                onChange={(e) => setNewBuyerSource(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBuyerSource())}
                className="flex-1 text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
              />
              <button
                type="button"
                onClick={handleAddBuyerSource}
                className="px-3 py-2 text-xs font-semibold rounded bg-surface-muted border border-border text-primary hover:bg-surface-hover flex items-center gap-1 min-h-[38px]"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="space-y-1.5 pt-1">
              {buyerSources.map((bs) => (
                <div
                  key={bs}
                  className="flex items-center justify-between p-2 rounded bg-surface-muted border border-border text-xs"
                >
                  <span className="font-medium text-primary">{bs}</span>
                  <button
                    type="button"
                    onClick={() =>
                      promptRemoveItem('CRM_SOURCE', bs, () =>
                        setBuyerSources(buyerSources.filter((s) => s !== bs)),
                      )
                    }
                    className="text-secondary hover:text-rose-600 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
                    title="Remove buyer source"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Property Configurations (Standard) */}
          <div className="pt-2 border-t border-border space-y-1.5">
            <label className="block text-xs font-semibold text-primary">
              BHK & Property Configurations (Standard System Presets)
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {buyerConfigs.map((cfg) => (
                <span
                  key={cfg}
                  className="px-2.5 py-1 rounded text-xs font-semibold bg-surface-muted text-primary border border-border"
                >
                  {cfg}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {statusMessage && (
        <div
          className={`p-3 rounded text-xs border max-w-2xl ${
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
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90 disabled:opacity-50 min-h-[44px]"
        >
          {isSaving ? 'Saving Changes...' : 'Save CRM Configuration'}
        </button>
      </div>

      {/* Consequential Impact Dialog */}
      <ImpactWarningDialog
        isOpen={impactDialog.isOpen}
        onClose={() => setImpactDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={impactDialog.onConfirm}
        title={impactDialog.title}
        itemName={impactDialog.itemName}
        impactMessage={impactDialog.impactMessage}
        affectedCount={impactDialog.affectedCount}
        safeToRemove={impactDialog.safeToRemove}
      />
    </div>
  );
};

