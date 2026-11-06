import React, { useState } from 'react';
import {
  BuyerPropertyType,
  BuyerPropertyConfiguration,
  ShareBuyerPropertyDto,
} from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import {
  BUYER_CONFIGURATION_LABELS,
  BUYER_PROPERTY_TYPE_LABELS,
} from './buyer-crm-constants';

interface ShareBuyerPropertyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: ShareBuyerPropertyDto) => Promise<void>;
  buyerName: string;
  defaultLocality?: string;
}

export const ShareBuyerPropertyDialog: React.FC<ShareBuyerPropertyDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  buyerName,
  defaultLocality,
}) => {
  const [propertyName, setPropertyName] = useState('');
  const [projectLocation, setProjectLocation] = useState(defaultLocality || '');
  const [propertyType, setPropertyType] = useState<BuyerPropertyType>(BuyerPropertyType.APARTMENT);
  const [configuration, setConfiguration] = useState<BuyerPropertyConfiguration>(
    BuyerPropertyConfiguration.THREE_BHK
  );
  const [estimatedPriceINR, setEstimatedPriceINR] = useState('');
  const [brochureUrl, setBrochureUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setPropertyName('');
      setProjectLocation(defaultLocality || '');
      setPropertyType(BuyerPropertyType.APARTMENT);
      setConfiguration(BuyerPropertyConfiguration.THREE_BHK);
      setEstimatedPriceINR('');
      setBrochureUrl('');
      setNotes('');
      setErrorMsg('');
      setIsSubmitting(false);
    }
  }, [isOpen, defaultLocality]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyName.trim()) {
      setErrorMsg('Property name is required.');
      return;
    }

    const priceNum = estimatedPriceINR ? Number(estimatedPriceINR) : undefined;
    if (priceNum !== undefined && isNaN(priceNum)) {
      setErrorMsg('Please enter a valid numeric estimated price in INR.');
      return;
    }

    const dto: ShareBuyerPropertyDto = {
      name: propertyName.trim(),
      location: projectLocation.trim() || 'Central',
      propertyType,
      configuration,
      priceEstimate: priceNum,
      feedback: notes.trim() || undefined,
    };

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSubmit(dto);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record shared property.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Record Shared Property"
      description={`Log a property or brochure shared with ${buyerName}.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        {errorMsg && (
          <div className="p-3 text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-md">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
              Property / Project Name *
            </label>
            <Input
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              placeholder="e.g. Total Environment Windmills"
              className="w-full text-xs"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
              Location
            </label>
            <Input
              value={projectLocation}
              onChange={(e) => setProjectLocation(e.target.value)}
              placeholder="e.g. Whitefield, Bangalore"
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
              Configuration
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
              Estimated Price (INR)
            </label>
            <Input
              type="number"
              value={estimatedPriceINR}
              onChange={(e) => setEstimatedPriceINR(e.target.value)}
              placeholder="e.g. 18500000"
              className="w-full text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
              Brochure Link / Asset URL
            </label>
            <Input
              type="url"
              value={brochureUrl}
              onChange={(e) => setBrochureUrl(e.target.value)}
              placeholder="https://..."
              className="w-full text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
            Buyer Feedback or Sharing Notes
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Sent PDF brochure via WhatsApp, buyer liked high floor unit..."
            className="w-full text-xs"
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-ch-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Recording...' : 'Save Shared Property'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
