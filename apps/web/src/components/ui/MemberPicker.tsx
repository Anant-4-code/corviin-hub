import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check, Search, User } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Avatar } from './Avatar';

export interface MemberOption {
  id: string;
  name: string;
  role?: string;
  email?: string;
}

interface MemberPickerProps {
  label?: string;
  selectedMemberId?: string;
  onSelect: (memberId: string | null) => void;
  members: MemberOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  helper?: string;
  className?: string;
}

export function MemberPicker({
  label = 'Assignee / Member',
  selectedMemberId,
  onSelect,
  members,
  placeholder = 'Select a team member…',
  required = false,
  error,
  helper,
  className,
}: MemberPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      (m.role && m.role.toLowerCase().includes(query.toLowerCase())),
  );

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
        {selectedMember ? (
          <div className="flex items-center gap-2 min-w-0">
            <Avatar name={selectedMember.name} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-ch-text-primary truncate leading-tight">
                {selectedMember.name}
              </p>
              {selectedMember.role && (
                <p className="text-[11px] text-ch-text-secondary truncate leading-none mt-0.5">
                  {selectedMember.role}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-ch-text-muted text-sm">
            <User size={15} />
            <span>{placeholder}</span>
          </div>
        )}

        <div className="flex items-center gap-1 shrink-0 text-ch-text-muted">
          {selectedMember && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
              className="p-1 hover:text-ch-text-primary rounded"
              aria-label="Clear member selection"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown size={15} />
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
              placeholder="Filter members…"
              className="w-full bg-transparent text-xs text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none"
              autoFocus
            />
          </div>

          <div className="max-h-52 overflow-y-auto divide-y divide-ch-border">
            {filteredMembers.length === 0 ? (
              <div className="p-3 text-center text-xs text-ch-text-muted">
                No matching members found
              </div>
            ) : (
              filteredMembers.map((m) => {
                const isSelected = m.id === selectedMemberId;
                return (
                  <div
                    key={m.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelect(m.id);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={cn(
                      'flex items-center justify-between p-2.5 cursor-pointer text-xs select-none',
                      isSelected ? 'bg-surface-selected text-accent font-medium' : 'hover:bg-surface-muted',
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar name={m.name} size="sm" />
                      <div className="min-w-0">
                        <p className="font-medium text-ch-text-primary truncate">{m.name}</p>
                        {m.role && <p className="text-[11px] text-ch-text-secondary truncate">{m.role}</p>}
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
