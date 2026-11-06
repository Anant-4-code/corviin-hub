import React, { useState, useEffect } from 'react';
import {
  BuyerPropertyType,
  BuyerPropertyConfiguration,
  BuyerBuyingTimeline,
  BuyerPurchasePurpose,
  CreateBuyerRecordDto,
  BuyerDuplicateMatchResult,
} from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import {
  BUYER_CONFIGURATION_LABELS,
  BUYER_PROPERTY_TYPE_LABELS,
  BUYER_TIMELINE_LABELS,
  BUYER_PURPOSE_LABELS,
  BUYER_LEAD_SOURCES,
} from './buyer-crm-constants';
import { checkBuyerDuplicates } from '@/services/crm';

interface CreateBuyerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateBuyerRecordDto) => Promise<void>;
  workspaceId: string;
  members: Array<{ id: string; name: string }>;
  onOpenExisting?: (recordId: string) => void;
}

export const CreateBuyerDialog: React.FC<CreateBuyerDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  workspaceId,
  members,
  onOpenExisting,
}) => {
  // Required Essentials
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [assignedMemberId, setAssignedMemberId] = useState(members[0]?.id || '');
  const [source, setSource] = useState(BUYER_LEAD_SOURCES[0]);

  // Progressive Disclosure Fields
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [email, setEmail] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'PHONE' | 'WHATSAPP' | 'EMAIL'>('WHATSAPP');
  const [preferredLocality, setPreferredLocality] = useState('');
  const [propertyType, setPropertyType] = useState<BuyerPropertyType>(BuyerPropertyType.APARTMENT);
  const [configuration, setConfiguration] = useState<BuyerPropertyConfiguration>(
    BuyerPropertyConfiguration.THREE_BHK
  );
  const [minBudgetINR, setMinBudgetINR] = useState('');
  const [maxBudgetINR, setMaxBudgetINR] = useState('');
  const [timeline, setTimeline] = useState<BuyerBuyingTimeline>(BuyerBuyingTimeline.ONE_TO_THREE_MONTHS);
  const [purpose, setPurpose] = useState<BuyerPurchasePurpose>(BuyerPurchasePurpose.END_USE);
  const [preferredProject, setPreferredProject] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [notes, setNotes] = useState('');

  // Duplicate Check State
  const [duplicateMatches, setDuplicateMatches] = useState<BuyerDuplicateMatchResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setFullName('');
      setPhone('');
      setAssignedMemberId(members[0]?.id || '');
      setSource(BUYER_LEAD_SOURCES[0]);
      setShowMoreDetails(false);
      setEmail('');
      setPreferredContactMethod('WHATSAPP');
      setPreferredLocality('');
      setPropertyType(BuyerPropertyType.APARTMENT);
      setConfiguration(BuyerPropertyConfiguration.THREE_BHK);
      setMinBudgetINR('');
      setMaxBudgetINR('');
      setTimeline(BuyerBuyingTimeline.ONE_TO_THREE_MONTHS);
      setPurpose(BuyerPurchasePurpose.END_USE);
      setPreferredProject('');
      setCampaignId('');
      setNotes('');
      setDuplicateMatches([]);
      setErrorMsg('');
      setIsSubmitting(false);
    }
  }, [isOpen, members]);

  // Non-blocking duplicate detection debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (
        (phone && phone.trim().length >= 8) ||
        (email && email.includes('@')) ||
        (fullName && fullName.trim().length >= 4)
      ) {
        try {
          const results = await checkBuyerDuplicates(workspaceId, {
            phone: phone.trim() || undefined,
            email: email.trim() || undefined,
            customerName: fullName.trim() || undefined,
          });
          setDuplicateMatches(results);
        } catch {
          // ignore duplicate check error
        }
      } else {
        setDuplicateMatches([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [phone, email, fullName, workspaceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Buyer full name is required.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Contact phone number is required.');
      return;
    }
    if (!assignedMemberId) {
      setErrorMsg('Please select an assigned team member.');
      return;
    }

    const assignedMember = members.find((m) => m.id === assignedMemberId);

    const minNum = minBudgetINR ? Number(minBudgetINR) : undefined;
    const maxNum = maxBudgetINR ? Number(maxBudgetINR) : undefined;

    if (minNum !== undefined && isNaN(minNum)) {
      setErrorMsg('Min budget must be a valid number.');
      return;
    }
    if (maxNum !== undefined && isNaN(maxNum)) {
      setErrorMsg('Max budget must be a valid number.');
      return;
    }
    if (minNum && maxNum && minNum > maxNum) {
      setErrorMsg('Min budget cannot exceed Max budget.');
      return;
    }

    const dto: CreateBuyerRecordDto = {
      customerName: fullName.trim(),
      phone: phone.trim(),
      assignedMemberId,
      assignedMemberName: assignedMember ? assignedMember.name : 'Unassigned',
      enquirySource: source.trim() || 'Direct',
      email: email.trim() || undefined,
      preferredContactMethod,
      locality: preferredLocality.trim() || undefined,
      propertyType: showMoreDetails ? propertyType : BuyerPropertyType.APARTMENT,
      configuration: showMoreDetails ? configuration : BuyerPropertyConfiguration.THREE_BHK,
      minBudget: showMoreDetails ? minNum : undefined,
      maxBudget: showMoreDetails ? maxNum : undefined,
      buyingTimeline: showMoreDetails ? timeline : undefined,
      purpose: showMoreDetails ? purpose : undefined,
      preferredProject: showMoreDetails && preferredProject.trim() ? preferredProject.trim() : undefined,
      sourceCampaign: showMoreDetails && campaignId.trim() ? campaignId.trim() : undefined,
      notes: notes.trim() || undefined,
    };

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSubmit(dto);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create buyer enquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Add New Real Estate Buyer"
      description="Register a high-intent home buyer or property investor into the sales pipeline."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {errorMsg && (
          <div className="p-3 text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-md">
            {errorMsg}
          </div>
        )}

        {/* Duplicate Warning Banner */}
        {duplicateMatches.length > 0 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-md space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-200">
              <span>⚠️ Potential Duplicate Buyer Detected ({duplicateMatches.length} match{duplicateMatches.length > 1 ? 'es' : ''})</span>
            </div>
            <div className="space-y-1">
              {duplicateMatches.map((match, idx) => (
                <div
                  key={match.record?.id || idx}
                  className="flex items-center justify-between text-xs bg-surface p-2 rounded border border-amber-200 dark:border-amber-900"
                >
                  <div>
                    <span className="font-semibold text-ch-text-primary">{match.record?.customerName}</span>{' '}
                    <span className="text-ch-text-tertiary">({match.record?.phone})</span>{' '}
                    <span className="text-[10px] text-ch-text-secondary bg-ch-bg px-1.5 py-0.5 rounded border border-ch-border">
                      Matched by {match.matchedBy}
                    </span>
                  </div>
                  {onOpenExisting && match.record?.id && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => {
                        onClose();
                        onOpenExisting(match.record.id);
                      }}
                    >
                      View Record
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-300">
              You can still submit to create a separate entry, or click 'View Record' to update the existing buyer.
            </p>
          </div>
        )}

        {/* Essential Fields */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-ch-text-secondary uppercase tracking-wider">
            Essential Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
                Buyer Full Name *
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className="w-full text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
                Phone Number (WhatsApp preferred) *
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
                Assigned Team Member *
              </label>
              <Select
                value={assignedMemberId}
                onChange={(e) => setAssignedMemberId(e.target.value)}
                className="w-full text-xs"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
                Lead Source *
              </label>
              <Select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full text-xs"
              >
                {BUYER_LEAD_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Progressive Disclosure Toggle */}
        <div className="pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="text-xs text-accent font-semibold flex items-center gap-1.5 p-0 hover:bg-transparent"
          >
            <span>{showMoreDetails ? '▼ Hide Detailed Requirements' : '► Add Property Preferences & Budget (Optional)'}</span>
          </Button>
        </div>

        {/* Progressive Disclosure Section */}
        {showMoreDetails && (
          <div className="space-y-4 pt-2 border-t border-ch-border">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vikram@example.com"
                  className="w-full text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
                  Preferred Contact
                </label>
                <Select
                  value={preferredContactMethod}
                  onChange={(e) => setPreferredContactMethod(e.target.value as any)}
                  className="w-full text-xs"
                >
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="PHONE">Phone Call</option>
                  <option value="EMAIL">Email</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
                  Preferred Locality
                </label>
                <Input
                  value={preferredLocality}
                  onChange={(e) => setPreferredLocality(e.target.value)}
                  placeholder="e.g. Whitefield, Indiranagar"
                  className="w-full text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
                  Property Type
                </label>
                <Select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as BuyerPropertyType)}
                  className="w-full text-xs"
                >
                  {Object.entries(BUYER_PROPERTY_TYPE_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
                  BHK Configuration
                </label>
                <Select
                  value={configuration}
                  onChange={(e) => setConfiguration(e.target.value as BuyerPropertyConfiguration)}
                  className="w-full text-xs"
                >
                  {Object.entries(BUYER_CONFIGURATION_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
                  Min Budget (INR)
                </label>
                <Input
                  type="number"
                  value={minBudgetINR}
                  onChange={(e) => setMinBudgetINR(e.target.value)}
                  placeholder="e.g. 15000000 (1.5 Cr)"
                  className="w-full text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
                  Max Budget (INR)
                </label>
                <Input
                  type="number"
                  value={maxBudgetINR}
                  onChange={(e) => setMaxBudgetINR(e.target.value)}
                  placeholder="e.g. 25000000 (2.5 Cr)"
                  className="w-full text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
                  Buying Timeline
                </label>
                <Select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value as BuyerBuyingTimeline)}
                  className="w-full text-xs"
                >
                  {Object.entries(BUYER_TIMELINE_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
                  Purchase Purpose
                </label>
                <Select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as BuyerPurchasePurpose)}
                  className="w-full text-xs"
                >
                  {Object.entries(BUYER_PURPOSE_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
                  Preferred Project (if any)
                </label>
                <Input
                  value={preferredProject}
                  onChange={(e) => setPreferredProject(e.target.value)}
                  placeholder="e.g. Sobha Neopolis"
                  className="w-full text-xs"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
            Initial Discussion Notes & Requirements
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Looking for East-facing Vastu compliant apartment on higher floor with 2 car parking slots..."
            className="w-full text-xs"
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-ch-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Register Buyer'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
