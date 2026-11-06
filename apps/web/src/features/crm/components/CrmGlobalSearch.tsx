import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CrmType, CrmRecordSummaryItem } from '@corviin-hub/shared';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { searchCrmRecords } from '@/services/crm';
import { Phone, MessageSquare, ArrowUpRight, Search, Building2, User, Clock } from 'lucide-react';

interface CrmGlobalSearchProps {
  workspaceId: string;
  workspaceType: 'TECH' | 'REAL_ESTATE';
  onScheduleFollowUp: (record: CrmRecordSummaryItem) => void;
}

export function CrmGlobalSearch({
  workspaceId,
  workspaceType,
  onScheduleFollowUp,
}: CrmGlobalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [recordType, setRecordType] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['crm-search', workspaceId, query, recordType],
    queryFn: () =>
      searchCrmRecords(workspaceId, {
        query: query.trim() || undefined,
        recordType: recordType ? (recordType as CrmType) : undefined,
        pageSize: 10,
      }),
    enabled: Boolean(workspaceId),
  });

  const records = data?.items || [];

  const handleNavigateToRecord = (record: CrmRecordSummaryItem) => {
    if (record.type === CrmType.TECH_LEAD || record.type === CrmType.TECH_CLIENT || record.type === CrmType.TECH_PARTNER) {
      navigate('/app/crm/tech');
    } else if (record.type === CrmType.RE_PARTNER) {
      navigate('/app/crm/real-estate/partners');
    } else if (record.type === CrmType.RE_BUYER) {
      navigate('/app/crm/real-estate/buyers');
    }
  };

  const getRecordTypeBadge = (type: CrmType) => {
    switch (type) {
      case CrmType.TECH_LEAD:
        return <Badge variant="primary" size="sm">TECH LEAD</Badge>;
      case CrmType.TECH_CLIENT:
        return <Badge variant="success" size="sm">CLIENT</Badge>;
      case CrmType.TECH_PARTNER:
        return <Badge variant="info" size="sm">TECH PARTNER</Badge>;
      case CrmType.RE_PARTNER:
        return <Badge variant="primary" size="sm">RE PARTNER</Badge>;
      case CrmType.RE_BUYER:
        return <Badge variant="info" size="sm">RE BUYER</Badge>;
    }
  };

  const cleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');

  return (
    <div className="p-3 bg-surface border border-ch-border space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input with direct string value handling */}
        <div className="flex-1">
          <SearchInput
            placeholder="Search CRM by name, company, phone (+91...), email, or requirement..."
            value={query}
            onChange={(val) => setQuery(val)}
            className="w-full"
          />
        </div>

        {/* Record Type Filter */}
        <div className="w-full sm:w-48 shrink-0">
          <Select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            options={
              workspaceType === 'TECH'
                ? [
                    { value: '', label: 'All Tech Records' },
                    { value: CrmType.TECH_LEAD, label: 'Enquiries / Leads' },
                    { value: CrmType.TECH_CLIENT, label: 'Client Accounts' },
                    { value: CrmType.TECH_PARTNER, label: 'Technology Partners' },
                  ]
                : [
                    { value: '', label: 'All Real Estate Records' },
                    { value: CrmType.RE_PARTNER, label: 'Developers & Partners' },
                    { value: CrmType.RE_BUYER, label: 'Buyers & Prospects' },
                  ]
            }
          />
        </div>
      </div>

      {/* Results View */}
      {query.trim().length > 0 && (
        <div className="border border-ch-border rounded-card bg-surface overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-ch-text-muted">Searching CRM records...</div>
          ) : records.length === 0 ? (
            <div className="p-4 text-center text-xs text-ch-text-muted">
              No matching CRM records found for "{query}".
            </div>
          ) : (
            <div className="divide-y divide-ch-border text-xs">
              {records.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 hover:bg-surface-hover/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {getRecordTypeBadge(rec.type)}
                      <h4 className="font-semibold text-ch-text-primary text-xs">{rec.name}</h4>
                      {rec.company && (
                        <span className="text-ch-text-muted text-[11px] flex items-center gap-1">
                          <Building2 size={11} />
                          <span>{rec.company}</span>
                        </span>
                      )}
                      <Badge variant="secondary" size="sm" className="text-[10px]">
                        {rec.stage}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-ch-text-secondary truncate max-w-xl">
                      {rec.requirementSummary}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-ch-text-muted">
                      <span>Owner: {rec.assignedMemberName}</span>
                      <span>•</span>
                      <span>Phone: {rec.phone}</span>
                      {rec.nextFollowUpDate && (
                        <>
                          <span>•</span>
                          <span className="text-warning font-medium flex items-center gap-1">
                            <Clock size={10} />
                            <span>Follow-up: {new Date(rec.nextFollowUpDate).toLocaleDateString()}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                    <a
                      href={`tel:${cleanPhone(rec.phone)}`}
                      className="p-1.5 rounded border border-ch-border bg-surface hover:bg-surface-hover text-ch-text-primary flex items-center gap-1 text-[11px]"
                      title={`Call ${rec.name}`}
                    >
                      <Phone size={12} className="text-primary" />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${cleanPhone(rec.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded border border-ch-border bg-surface hover:bg-surface-hover text-ch-text-primary flex items-center gap-1 text-[11px]"
                      title={`WhatsApp message to ${rec.name}`}
                    >
                      <MessageSquare size={12} className="text-emerald-500" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onScheduleFollowUp(rec)}
                      className="text-[11px] py-1 px-2 h-7"
                    >
                      Follow-up
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigateToRecord(rec)}
                      className="text-[11px] py-1 px-2 h-7 text-primary gap-1"
                    >
                      <span>Pipeline</span>
                      <ArrowUpRight size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

