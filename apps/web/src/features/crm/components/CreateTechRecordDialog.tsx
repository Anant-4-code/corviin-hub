import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Building2,
  User,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { FormField } from '@/components/ui/FormField';
import {
  TechRecordCategory,
  TechPipelineStage,
  CreateTechRecordDto,
  DuplicateMatchResult,
} from '@corviin-hub/shared';
import { checkTechDuplicates } from '@/services/crm';
import {
  TECH_CATEGORY_LABELS,
  TECH_SERVICE_TYPES,
  TECH_LEAD_SOURCES,
} from './tech-crm-constants';

interface MemberOption {
  id: string;
  name: string;
}

interface CreateTechRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateTechRecordDto) => Promise<void>;
  workspaceId: string;
  members: MemberOption[];
  onOpenExistingRecord?: (recordId: string) => void;
}

export function CreateTechRecordDialog({
  isOpen,
  onClose,
  onSubmit,
  workspaceId,
  members,
  onOpenExistingRecord,
}: CreateTechRecordDialogProps) {
  // Required essentials
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<TechRecordCategory>(
    TechRecordCategory.SOFTWARE_WEBSITE_ENQUIRY,
  );
  const [assignedMemberId, setAssignedMemberId] = useState(
    members[0]?.id || '',
  );
  const [source, setSource] = useState('Website');

  // Progressive details
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [serviceType, setServiceType] = useState('WEB_DEVELOPMENT');
  const [requirementSummary, setRequirementSummary] = useState('');
  const [detailedRequirements, setDetailedRequirements] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Duplicate warning state
  const [duplicateMatch, setDuplicateMatch] = useState<DuplicateMatchResult | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setCompany('');
      setPhone('');
      setEmail('');
      setCategory(TechRecordCategory.SOFTWARE_WEBSITE_ENQUIRY);
      setAssignedMemberId(members[0]?.id || '');
      setSource('Website');
      setShowMoreDetails(false);
      setServiceType('WEB_DEVELOPMENT');
      setRequirementSummary('');
      setDetailedRequirements('');
      setEstimatedBudget('');
      setBusinessType('');
      setWebsite('');
      setLocation('');
      setNotes('');
      setDuplicateMatch(null);
      setErrorMessage('');
    }
  }, [isOpen, members]);

  // Check for duplicates on blur of phone, email, or company
  const handleCheckDuplicate = async () => {
    if (!phone && !email && !company) return;
    try {
      setIsCheckingDuplicate(true);
      const match = await checkTechDuplicates(workspaceId, {
        phone: phone || undefined,
        email: email || undefined,
        company: company || undefined,
      });
      setDuplicateMatch(match);
    } catch {
      // Non-fatal
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() && !company.trim()) {
      setErrorMessage('Please provide either a contact person name or company name.');
      return;
    }

    if (!phone.trim() && !email.trim()) {
      setErrorMessage('Please provide a reliable contact method (phone number or email).');
      return;
    }

    if (!assignedMemberId) {
      setErrorMessage('Please select an assigned account lead.');
      return;
    }

    const assignedMember = members.find((m) => m.id === assignedMemberId);

    const dto: CreateTechRecordDto = {
      name: name.trim() || undefined,
      company: company.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      category,
      source: source.trim() || 'Website',
      assignedMemberId,
      assignedMemberName: assignedMember?.name || 'Account Lead',
      serviceType: serviceType || undefined,
      requirementSummary:
        requirementSummary.trim() ||
        `${serviceType ? serviceType.replace('_', ' ') : 'Technology'} enquiry for ${company || name}`,
      detailedRequirements: detailedRequirements.trim() || undefined,
      estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : undefined,
      businessType: businessType.trim() || undefined,
      website: website.trim() || undefined,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      initialStage: TechPipelineStage.NEW_ENQUIRY,
    };

    try {
      setIsSubmitting(true);
      await onSubmit(dto);
      onClose();
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Failed to create Tech CRM record. Please verify fields.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Add Corviin Tech Enquiry / Record"
      description="Capture new technology enquiries, prospective projects, or alliance partners."
      size="lg"
    >
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* Duplicate warning banner */}
        {duplicateMatch && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Possible duplicate detected:</span> Matching {duplicateMatch.matchedBy} with existing record "{duplicateMatch.record.company}" ({duplicateMatch.record.name}).
              </div>
            </div>
            {onOpenExistingRecord && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onClose();
                  onOpenExistingRecord(duplicateMatch.record.id);
                }}
                className="h-7 text-xs whitespace-nowrap bg-surface"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        )}

        {errorMessage && (
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Section 1: Required Essentials */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-ch-text-primary uppercase tracking-wider border-b border-ch-border pb-1">
              Required Essentials
            </h4>

            {/* Company & Contact Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField label="Company / Entity Name" required>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  onBlur={handleCheckDuplicate}
                  placeholder="e.g. Acme FinTech Pvt Ltd"
                  className="h-8 text-xs"
                />
              </FormField>
              <FormField label="Contact Person Name" required>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar (CTO)"
                  className="h-8 text-xs"
                />
              </FormField>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField label="Phone Number" required>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={handleCheckDuplicate}
                  placeholder="e.g. +91 98201 12345"
                  className="h-8 text-xs"
                />
              </FormField>
              <FormField label="Email Address">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleCheckDuplicate}
                  type="email"
                  placeholder="e.g. rajesh@acmefin.com"
                  className="h-8 text-xs"
                />
              </FormField>
            </div>

            {/* Category & Assigned Lead */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField label="Record Category" required>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TechRecordCategory)}
                  className="h-8 text-xs"
                >
                  {Object.entries(TECH_CATEGORY_LABELS).map(([cat, label]) => (
                    <option key={cat} value={cat}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Assigned Lead" required>
                <Select
                  value={assignedMemberId}
                  onChange={(e) => setAssignedMemberId(e.target.value)}
                  className="h-8 text-xs"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            {/* Lead Source */}
            <FormField label="Lead / Enquiry Source" required>
              <Select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="h-8 text-xs"
              >
                {TECH_LEAD_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </FormField>

            {/* Requirement Summary */}
            <FormField label="Initial Service / Requirement Summary" required>
              <Input
                value={requirementSummary}
                onChange={(e) => setRequirementSummary(e.target.value)}
                placeholder="e.g. Cloud infrastructure migration and Kubernetes setup"
                className="h-8 text-xs"
              />
            </FormField>
          </div>

          {/* Toggle for Progressive / Optional Details */}
          <div className="pt-2 border-t border-ch-border">
            <button
              type="button"
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              className="flex items-center gap-1.5 text-xs font-semibold text-ch-accent hover:underline"
            >
              <span>{showMoreDetails ? 'Hide additional details' : 'More details (service, budget, scope, website)...'}</span>
              {showMoreDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Section 2: Optional Progressive Details */}
          {showMoreDetails && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Primary Service Type">
                  <Select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="h-8 text-xs"
                  >
                    {TECH_SERVICE_TYPES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Estimated Budget (INR, optional)">
                  <Input
                    type="number"
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(e.target.value)}
                    placeholder="e.g. 500000"
                    className="h-8 text-xs"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField label="Business Type / Industry">
                  <Input
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="e.g. FinTech / Core Banking"
                    className="h-8 text-xs"
                  />
                </FormField>

                <FormField label="Website">
                  <Input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="h-8 text-xs"
                  />
                </FormField>

                <FormField label="Location">
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. BKC, Mumbai"
                    className="h-8 text-xs"
                  />
                </FormField>
              </div>

              <FormField label="Detailed Requirements & Tech Scope">
                <Textarea
                  value={detailedRequirements}
                  onChange={(e) => setDetailedRequirements(e.target.value)}
                  placeholder="Outline key deliverables, tech stack requirements, integration points, timelines..."
                  rows={3}
                  className="text-xs"
                />
              </FormField>

              <FormField label="Internal Notes">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Initial impressions, stakeholder dynamics, budget flexibility..."
                  rows={2}
                  className="text-xs"
                />
              </FormField>
            </div>
          )}

          <div className="pt-3 border-t border-ch-border flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-8 text-xs font-semibold bg-ch-accent text-white hover:bg-ch-accent/90"
            >
              {isSubmitting ? 'Creating...' : 'Create Tech Record'}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
