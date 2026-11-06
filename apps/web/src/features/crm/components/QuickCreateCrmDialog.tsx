import { useState, useEffect } from 'react';
import { CrmType } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { AlertCircle, UserPlus } from 'lucide-react';
import { createCrmRecord } from '@/services/crm';

interface QuickCreateCrmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceType: 'TECH' | 'REAL_ESTATE';
  initialType?: CrmType;
  onSuccess: () => void;
}

export function QuickCreateCrmDialog({
  isOpen,
  onClose,
  workspaceId,
  workspaceType,
  initialType,
  onSuccess,
}: QuickCreateCrmDialogProps) {
  const [recordType, setRecordType] = useState<CrmType>(
    initialType || (workspaceType === 'TECH' ? CrmType.TECH_LEAD : CrmType.RE_BUYER),
  );

  useEffect(() => {
    if (initialType) {
      setRecordType(initialType);
    } else {
      setRecordType(workspaceType === 'TECH' ? CrmType.TECH_LEAD : CrmType.RE_BUYER);
    }
  }, [initialType, workspaceType]);

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requirementSummary, setRequirementSummary] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [projectOrLocation, setProjectOrLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setCompany('');
    setPhone('');
    setEmail('');
    setRequirementSummary('');
    setEstimatedValue('');
    setProjectOrLocation('');
    setNotes('');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Name is required.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Phone number is required for CRM contact.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await createCrmRecord(workspaceId, {
        type: recordType,
        name: name.trim(),
        company: company.trim() || undefined,
        phone: phone.trim(),
        email: email.trim() || undefined,
        requirementSummary: requirementSummary.trim() || undefined,
        estimatedValue: estimatedValue ? parseInt(estimatedValue, 10) : undefined,
        projectOrLocation: projectOrLocation.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to create record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTech = workspaceType === 'TECH';

  return (
    <Dialog open={isOpen} onClose={onClose} title="Create New CRM Record" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMessage && (
          <div className="p-3 rounded bg-danger/10 border border-danger/30 text-danger flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="text-[11px]">{errorMessage}</p>
          </div>
        )}

        {/* Record Type Selector */}
        <div>
          <label className="text-[11px] text-ch-text-secondary block mb-1">CRM Record Type *</label>
          <Select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value as CrmType)}
            options={
              isTech
                ? [
                    { value: CrmType.TECH_LEAD, label: 'Tech Lead / Project Enquiry' },
                    { value: CrmType.TECH_CLIENT, label: 'Client Account (Commercial)' },
                    { value: CrmType.TECH_PARTNER, label: 'Technology Alliance / Partner' },
                  ]
                : [
                    { value: CrmType.RE_BUYER, label: 'Property Buyer / Lead' },
                    { value: CrmType.RE_PARTNER, label: 'Developer / Landowner / Broker' },
                  ]
            }
          />
        </div>

        {/* Primary Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-ch-text-secondary block mb-1">
              {recordType === CrmType.RE_PARTNER ? 'Primary Contact Person *' : 'Client / Lead Name *'}
            </label>
            <Input
              required
              placeholder="e.g. Vikram Malhotra"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[11px] text-ch-text-secondary block mb-1">
              {recordType === CrmType.RE_PARTNER ? 'Developer / Company Name *' : 'Company Name (Optional)'}
            </label>
            <Input
              placeholder={recordType === CrmType.RE_PARTNER ? 'e.g. Skyline Developers Pvt Ltd' : 'e.g. Acme Corp'}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-ch-text-secondary block mb-1">Phone Number (Required) *</label>
            <Input
              required
              placeholder="e.g. +91 98201 12345"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[11px] text-ch-text-secondary block mb-1">Email Address (Optional)</label>
            <Input
              type="email"
              placeholder="e.g. contact@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Requirement & Budget / Location details */}
        <div>
          <label className="text-[11px] text-ch-text-secondary block mb-1">
            {recordType === CrmType.RE_BUYER
              ? 'Property Requirement (Bedrooms, Unit Type, Preferences)'
              : 'Requirement / Project Scope Overview'}
          </label>
          <Textarea
            rows={2}
            placeholder={
              recordType === CrmType.RE_BUYER
                ? 'e.g. 3BHK or 4BHK luxury villa with private pool and garden view'
                : 'e.g. Mobile app development with offline sync and payment integration'
            }
            value={requirementSummary}
            onChange={(e) => setRequirementSummary(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-ch-text-secondary block mb-1">
              {recordType === CrmType.RE_BUYER
                ? 'Target Budget (INR)'
                : 'Estimated Value / Deal Size (INR)'}
            </label>
            <Input
              type="number"
              placeholder="e.g. 35000000"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[11px] text-ch-text-secondary block mb-1">
              {recordType === CrmType.RE_BUYER
                ? 'Preferred Project / Location'
                : 'Location / Platform'}
            </label>
            <Input
              placeholder={recordType === CrmType.RE_BUYER ? 'e.g. Emerald Heights' : 'e.g. Web & Mobile'}
              value={projectOrLocation}
              onChange={(e) => setProjectOrLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-[11px] text-ch-text-secondary block mb-1">Initial Interaction Note</label>
          <Input
            placeholder="e.g. Came via website lead form; requested morning call"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-ch-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5"
          >
            <UserPlus size={13} />
            <span>{isSubmitting ? 'Creating...' : 'Create CRM Record'}</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

