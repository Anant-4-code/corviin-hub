import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check, Search, Link2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { StatusBadge } from './StatusBadge';

export type RelatedRecordType = 'task' | 'campaign' | 'meeting' | 'crm' | 'asset' | 'goal';

export interface RelatedRecordItem {
  id: string;
  title: string;
  type: RelatedRecordType;
  subtitle?: string;
}

interface RelatedRecordPickerProps {
  label?: string;
  selectedRecordId?: string;
  onSelect: (record: RelatedRecordItem | null) => void;
  records: RelatedRecordItem[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  helper?: string;
  className?: string;
}

export function RelatedRecordPicker({
  label = 'Related Record',
  selectedRecordId,
  onSelect,
  records,
  placeholder = 'Link to a task, campaign, meeting or CRM record…',
  required = false,
  error,
  helper,
  className,
}: RelatedRecordPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedRecord = records.find((r) => r.id === selectedRecordId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRecords = records.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.type.toLowerCase().includes(query.toLowerCase()) ||
      (r.subtitle && r.subtitle.toLowerCase().includes(query.toLowerCase())),
  );

  const getTypeBadge = (type: RelatedRecordType) => {
    switch (type) {
      case 'task':
        return <StatusBadge type="info" label="Task" />;
      case 'campaign':
        return <StatusBadge type="warning" label="Campaign" />;
      case 'meeting':
        return <StatusBadge type="success" label="Meeting" />;
      case 'crm':
        return <StatusBadge type="danger" label="CRM" />;
      case 'goal':
        return <StatusBadge type="neutral" label="Goal" />;
      case 'asset':
        return <StatusBadge type="neutral" label="Asset" />;
    }
  };

  return (
    <div ref={containerRef} className={cn('relative flex flex-col gap-1', className)}>
      {label && (
        <label className="text-sm font-medium text-ch-text-primary">
          {label}
          {required && <span className="ml-1 text-danger" aria-label="required">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className={cn(
          'min-h-[40px] px-3 py-1.5 rounded-control border bg-surface flex items-center justify-between gap-2 cursor-pointer select-none',
          'focus-visible:outline-2 focus-visible:outline-accent',
          error ? 'border-danger' : 'border-ch-border hover:border-ch-border-strong',
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedRecord ? (
          <div className="flex items-center gap-2 min-w-0">
            {getTypeBadge(selectedRecord.type)}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ch-text-primary truncate">
                {selectedRecord.title}
              </p>
              {selectedRecord.subtitle && (
                <p className="text-[11px] text-ch-text-secondary truncate">{selectedRecord.subtitle}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-ch-text-muted text-xs">
            <Link2 size={14} />
            <span>{placeholder}</span>
          </div>
        )}

        <div className="flex items-center gap-1 shrink-0 text-ch-text-muted">
          {selectedRecord && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
              className="p-1 hover:text-ch-text-primary rounded"
              aria-label="Clear linked record"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown size={14} />
        </div>
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}
      {helper && !error && <p className="text-xs text-ch-text-muted">{helper}</p>}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-surface border border-ch-border rounded-control shadow-lg overflow-hidden">
          <div className="p-2 border-b border-ch-border flex items-center gap-2 bg-surface-muted">
            <Search size={14} className="text-ch-text-muted shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or type…"
              className="w-full bg-transparent text-xs text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none"
              autoFocus
            />
          </div>

          <div className="max-h-52 overflow-y-auto divide-y divide-ch-border">
            {filteredRecords.length === 0 ? (
              <div className="p-3 text-center text-xs text-ch-text-muted">
                No matching records found
              </div>
            ) : (
              filteredRecords.map((r) => {
                const isSelected = r.id === selectedRecordId;
                return (
                  <div
                    key={r.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelect(r);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={cn(
                      'flex items-center justify-between p-2.5 cursor-pointer text-xs select-none',
                      isSelected ? 'bg-surface-selected text-accent font-medium' : 'hover:bg-surface-muted',
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {getTypeBadge(r.type)}
                      <div className="min-w-0">
                        <p className="font-semibold text-ch-text-primary truncate">{r.title}</p>
                        {r.subtitle && <p className="text-[11px] text-ch-text-secondary truncate">{r.subtitle}</p>}
                      </div>
                    </div>
                    {isSelected && <Check size={14} className="text-accent shrink-0 ml-2" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
