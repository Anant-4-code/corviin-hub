import React, { useState, useEffect } from 'react';
import {
  RealEstatePartnerType,
  RealEstatePartnerStage,
  CreatePartnerRecordDto,
  PartnerDuplicateMatchResult,
} from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import {
  PARTNER_TYPE_LABELS,
  PARTNER_MARKETING_REQUIREMENTS,
  PARTNER_LEAD_SOURCES,
} from './partner-crm-constants';
import { checkPartnerDuplicates } from '@/services/crm';

interface CreatePartnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreatePartnerRecordDto) => Promise<void>;
  workspaceId: string;
  members: Array<{ id: string; name: string }>;
  onOpenExisting?: (recordId: string) => void;
}

export const CreatePartnerDialog: React.FC<CreatePartnerDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  workspaceId,
  members,
  onOpenExisting,
}) => {
  // Required Essentials
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [partnerType, setPartnerType] = useState<RealEstatePartnerType>(RealEstatePartnerType.DEVELOPER);
  const [assignedMemberId, setAssignedMemberId] = useState(members[0]?.id || '');

  // Progressive Disclosure Fields
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [source, setSource] = useState(PARTNER_LEAD_SOURCES[0]);
  const [partnershipInterest, setPartnershipInterest] = useState('');
  const [serviceRequirementsText, setServiceRequirementsText] = useState('');
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  // Initial Project details
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState<'RESIDENTIAL' | 'COMMERCIAL' | 'PLOTTED_DEVELOPMENT' | 'LUXURY_VILLAS' | 'MIXED_USE'>('RESIDENTIAL');
  const [projectLocation, setProjectLocation] = useState('');
  const [projectRera, setProjectRera] = useState('');
  const [projectUnits, setProjectUnits] = useState('');

  // Duplicate Check State
  const [duplicateMatches, setDuplicateMatches] = useState<PartnerDuplicateMatchResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setCompanyName('');
      setContactPerson('');
      setPhone('');
      setPartnerType(RealEstatePartnerType.DEVELOPER);
      setAssignedMemberId(members[0]?.id || '');
      setShowMoreDetails(false);
      setEmail('');
      setLocation('');
      setWebsite('');
      setSource(PARTNER_LEAD_SOURCES[0]);
      setPartnershipInterest('');
      setServiceRequirementsText('');
      setSelectedRequirements([]);
      setNotes('');
      setProjectName('');
      setProjectRera('');
      setProjectUnits('');
      setDuplicateMatches([]);
      setErrorMsg('');
      setIsSubmitting(false);
    }
  }, [isOpen, members]);

  // Non-blocking duplicate detection debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if ((phone && phone.trim().length >= 8) || (email && email.includes('@')) || (companyName && companyName.trim().length >= 4)) {
        try {
          const results = await checkPartnerDuplicates(workspaceId, {
            phone: phone.trim() || undefined,
            email: email.trim() || undefined,
            companyName: companyName.trim() || undefined,
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
  }, [phone, email, companyName, workspaceId]);

  const toggleRequirement = (req: string) => {
    if (selectedRequirements.includes(req)) {
      setSelectedRequirements(selectedRequirements.filter((r) => r !== req));
    } else {
      setSelectedRequirements([...selectedRequirements, req]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setErrorMsg('Company or partner name is required.');
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

    const dto: CreatePartnerRecordDto = {
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim() || undefined,
      phone: phone.trim(),
      partnerType,
      assignedMemberId,
      assignedMemberName: assignedMember?.name,
      email: email.trim() || undefined,
      location: location.trim() || undefined,
      website: website.trim() || undefined,
      source: source.trim() || undefined,
      partnershipInterest: partnershipInterest.trim() || undefined,
      serviceRequirementsText: serviceRequirementsText.trim() || undefined,
      marketingRequirements: selectedRequirements,
      notes: notes.trim() || undefined,
      initialStage: RealEstatePartnerStage.NEW_PARTNER_LEAD,
      initialProject: projectName.trim()
        ? {
            name: projectName.trim(),
            projectType,
            location: projectLocation.trim() || location.trim() || 'Maharashtra',
            reraNumber: projectRera.trim() || undefined,
            totalUnitsOrAcres: projectUnits.trim() || undefined,
            status: 'UPCOMING',
          }
        : undefined,
    };

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSubmit(dto);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create partner record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Create Real Estate Developer / Partner"
      description="Register a new developer, builder, landowner, or broker partnership lead for Corviin Real Estate."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded text-xs text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Duplicate Warning Banner (Non-blocking) */}
        {duplicateMatches.length > 0 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                ⚠️ Potential Duplicate Detected ({duplicateMatches.length} existing record):
              </span>
              {onOpenExisting && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onOpenExisting(duplicateMatches[0].record.id);
                    onClose();
                  }}
                  className="text-xs h-6 px-2 text-amber-900 dark:text-amber-200 border-amber-400"
                >
                  View Existing Record
                </Button>
              )}
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              Matches <strong>{duplicateMatches[0].record.companyName}</strong> by {duplicateMatches[0].matchedBy} (
              {duplicateMatches[0].record.phone})
            </p>
          </div>
        )}

        {/* ============================================================
            SECTION 1: REQUIRED ESSENTIALS
           ============================================================ */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-ch-text-secondary uppercase tracking-wider">
            Required Essentials
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Company / Partner Name */}
            <div>
              <label className="block text-xs font-medium text-ch-text-primary mb-1">
                Company / Organization Name <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Godrej Properties, Skyline Infra"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-xs font-medium text-ch-text-primary mb-1">
                Key Contact Person
              </label>
              <Input
                placeholder="e.g. Sanjay Mehta (Managing Director)"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-ch-text-primary mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. +91 99301 11223"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            {/* Partner Type */}
            <div>
              <label className="block text-xs font-medium text-ch-text-primary mb-1">
                Partner Type <span className="text-rose-500">*</span>
              </label>
              <Select
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value as RealEstatePartnerType)}
                required
                className="text-xs"
              >
                {Object.values(RealEstatePartnerType).map((t) => (
                  <option key={t} value={t}>
                    {PARTNER_TYPE_LABELS[t]}
                  </option>
                ))}
              </Select>
            </div>

            {/* Assigned Member */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-ch-text-primary mb-1">
                Assigned Team Member <span className="text-rose-500">*</span>
              </label>
              <Select
                value={assignedMemberId}
                onChange={(e) => setAssignedMemberId(e.target.value)}
                required
                className="text-xs"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* ============================================================
            SECTION 2: PROGRESSIVE DISCLOSURE TOGGLE
           ============================================================ */}
        <div className="pt-2 border-t border-ch-border">
          <button
            type="button"
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
          >
            {showMoreDetails ? '▲ Hide additional project & commercial details' : '▼ More details (Location, Projects, Services, Website)'}
          </button>
        </div>

        {showMoreDetails && (
          <div className="space-y-4 pt-2">
            {/* Location & Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ch-text-primary mb-1">
                  Location (City / Area)
                </label>
                <Input
                  placeholder="e.g. Alibaug, Worli Mumbai, North Pune"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ch-text-primary mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="e.g. contact@skylinedev.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ch-text-primary mb-1">
                  Website URL
                </label>
                <Input
                  placeholder="e.g. https://skylinedevelopers.in"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ch-text-primary mb-1">
                  Lead Source
                </label>
                <Select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="text-xs"
                >
                  {PARTNER_LEAD_SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Initial Project Reference */}
            <div className="bg-ch-bg p-3 rounded-lg border border-ch-border space-y-2">
              <h5 className="text-xs font-bold text-ch-text-primary">
                🏢 Initial Project / Development Reference (Optional)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-ch-text-secondary mb-1">
                    Project Name
                  </label>
                  <Input
                    placeholder="e.g. Emerald Heights Luxury Villas"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-ch-text-secondary mb-1">
                    Development Type
                  </label>
                  <Select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as any)}
                    className="text-xs"
                  >
                    <option value="RESIDENTIAL">Residential Apartment</option>
                    <option value="LUXURY_VILLAS">Luxury Villas</option>
                    <option value="COMMERCIAL">Commercial / Office</option>
                    <option value="PLOTTED_DEVELOPMENT">Plotted Development / Land</option>
                    <option value="MIXED_USE">Mixed Use</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-ch-text-secondary mb-1">
                    Project Location / Micro-market
                  </label>
                  <Input
                    placeholder="e.g. Awas Road, Alibaug"
                    value={projectLocation}
                    onChange={(e) => setProjectLocation(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-ch-text-secondary mb-1">
                    RERA Registration Number
                  </label>
                  <Input
                    placeholder="e.g. P52000018902"
                    value={projectRera}
                    onChange={(e) => setProjectRera(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-medium text-ch-text-secondary mb-1">
                    Total Units or Acreage
                  </label>
                  <Input
                    placeholder="e.g. 45 Private Pool Villas or 15 Acres"
                    value={projectUnits}
                    onChange={(e) => setProjectUnits(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Marketing & Service Requirements */}
            <div>
              <label className="block text-xs font-medium text-ch-text-primary mb-1">
                Marketing & Service Requirements
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {PARTNER_MARKETING_REQUIREMENTS.map((req) => {
                  const isSelected = selectedRequirements.includes(req);
                  return (
                    <button
                      key={req}
                      type="button"
                      onClick={() => toggleRequirement(req)}
                      className={`px-2 py-1 rounded text-xs border font-medium ${
                        isSelected
                          ? 'bg-accent text-white border-accent'
                          : 'bg-surface text-ch-text-secondary border-ch-border hover:bg-ch-bg'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {req}
                    </button>
                  );
                })}
              </div>
              <Input
                placeholder="Specific commercial scope or commission notes..."
                value={serviceRequirementsText}
                onChange={(e) => setServiceRequirementsText(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Partnership Interest & Notes */}
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-ch-text-primary mb-1">
                  Partnership Intent / Model
                </label>
                <Input
                  placeholder="e.g. Sole Selling Agency, Digital Mandate, Joint Venture Advisory"
                  value={partnershipInterest}
                  onChange={(e) => setPartnershipInterest(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ch-text-primary mb-1">
                  Initial Background Notes
                </label>
                <Textarea
                  placeholder="Enter promoter background, meeting remarks, key priorities..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-ch-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Partner'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
