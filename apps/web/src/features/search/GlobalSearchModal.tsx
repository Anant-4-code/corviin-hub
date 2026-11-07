import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Clock,
  CheckSquare,
  Megaphone,
  Users2,
  Video,
  Target,
  FolderOpen,
  ArrowRight,
  PlusCircle,
  Layers,
} from 'lucide-react';
import { fetchGlobalSearch } from '@/services/search';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useAppStore } from '@/lib/store';
import {
  SearchEntityType,
  SearchResultItem,
  GlobalSearchResponse,
} from '@corviin-hub/shared';
import { cn } from '@/lib/cn';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreate?: (entityType?: SearchEntityType) => void;
}

const CATEGORY_TABS: { key: string; label: string; type?: SearchEntityType }[] = [
  { key: 'ALL', label: 'All Results' },
  { key: SearchEntityType.TASK, label: 'Tasks', type: SearchEntityType.TASK },
  { key: SearchEntityType.CRM, label: 'CRM', type: SearchEntityType.CRM },
  { key: SearchEntityType.CAMPAIGN, label: 'Campaigns', type: SearchEntityType.CAMPAIGN },
  { key: SearchEntityType.MEETING, label: 'Meetings', type: SearchEntityType.MEETING },
  { key: SearchEntityType.PLAN_GOAL, label: 'Plans & Goals', type: SearchEntityType.PLAN_GOAL },
  { key: SearchEntityType.ASSET, label: 'Assets', type: SearchEntityType.ASSET },
  { key: SearchEntityType.TEAM, label: 'Team', type: SearchEntityType.TEAM },
];

export function GlobalSearchModal({ isOpen, onClose, onOpenCreate }: GlobalSearchModalProps) {
  const navigate = useNavigate();
  const { data: workspaces } = useWorkspaces();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const currentWorkspace = workspaces?.find((w) => w.id === selectedWorkspaceId);
  const workspaceId = currentWorkspace?.id;
  const workspaceSlug = currentWorkspace?.slug;

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResponse, setSearchResponse] = useState<GlobalSearchResponse | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const storageKey = `corviin_recent_searches_${workspaceSlug || 'default'}`;

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      }
    } catch {
      setRecentSearches([]);
    }
  }, [storageKey, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const focusMs = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test' ? 0 : 50;
      setTimeout(() => {
        inputRef.current?.focus();
      }, focusMs);
    } else {
      setQuery('');
      setSearchResponse(null);
      setError(null);
      setActiveIndex(0);
    }
  }, [isOpen]);

  const saveRecentSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      try {
        const current = recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
        const updated = [trimmed, ...current].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
    },
    [recentSearches, storageKey],
  );

  const clearRecentSearches = () => {
    try {
      localStorage.removeItem(storageKey);
      setRecentSearches([]);
    } catch {
      // ignore
    }
  };

  // Perform debounced search with cancellation and stale protection
  useEffect(() => {
    if (!isOpen) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const trimmed = query.trim();
    if (!trimmed || !workspaceId) {
      setSearchResponse(null);
      setLoading(false);
      setError(null);
      setActiveIndex(0);
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const debounceMs =
      (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') ||
      import.meta.env?.MODE === 'test'
        ? 10
        : 250;

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const typesFilter = activeCategory !== 'ALL' ? activeCategory : undefined;
        const res = await fetchGlobalSearch(
          {
            q: trimmed,
            workspaceId,
            types: typesFilter,
            limit: 5,
          },
          controller.signal,
        );

        // Stale protection: confirm query matches current text
        if (res.query.toLowerCase() === trimmed.toLowerCase()) {
          setSearchResponse(res);
          setActiveIndex(0);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'An error occurred while searching.');
        }
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query, activeCategory, workspaceId, isOpen]);

  // Flattened displayed items for keyboard selection
  const displayedItems: SearchResultItem[] = (() => {
    if (!searchResponse) return [];
    if (activeCategory === 'ALL') {
      return searchResponse.items;
    }
    const group = searchResponse.groups[activeCategory];
    return group ? group.items : [];
  })();

  const handleSelectItem = (item: SearchResultItem) => {
    saveRecentSearch(query || item.title);
    onClose();
    // Route paths in web app use /app prefix
    const path = item.targetUrl.startsWith('/app') ? item.targetUrl : `/app${item.targetUrl}`;
    navigate(path);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (displayedItems.length > 0) {
        setActiveIndex((prev) => (prev + 1) % displayedItems.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (displayedItems.length > 0) {
        setActiveIndex((prev) => (prev - 1 + displayedItems.length) % displayedItems.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (displayedItems.length > 0 && displayedItems[activeIndex]) {
        handleSelectItem(displayedItems[activeIndex]);
      }
    }
  };

  if (!isOpen) return null;

  const getEntityIcon = (type: SearchEntityType) => {
    switch (type) {
      case SearchEntityType.TASK:
        return <CheckSquare size={16} className="text-blue-500 shrink-0" />;
      case SearchEntityType.CAMPAIGN:
        return <Megaphone size={16} className="text-purple-500 shrink-0" />;
      case SearchEntityType.CRM:
        return <Users2 size={16} className="text-emerald-500 shrink-0" />;
      case SearchEntityType.MEETING:
        return <Video size={16} className="text-amber-500 shrink-0" />;
      case SearchEntityType.PLAN_GOAL:
        return <Target size={16} className="text-rose-500 shrink-0" />;
      case SearchEntityType.ASSET:
        return <FolderOpen size={16} className="text-cyan-500 shrink-0" />;
      case SearchEntityType.TEAM:
        return <Users2 size={16} className="text-indigo-500 shrink-0" />;
      default:
        return <Layers size={16} className="text-ch-text-secondary shrink-0" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 md:p-6 bg-black/60"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
    >
      <div
        className={cn(
          'w-full max-w-3xl flex flex-col bg-surface border border-ch-border shadow-2xl',
          'h-full sm:h-auto sm:max-h-[85vh] sm:rounded-lg overflow-hidden',
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header / Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ch-border bg-surface-muted/40 shrink-0">
          <Search size={20} className="text-ch-text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${currentWorkspace?.name || 'workspace'}...`}
            className="flex-1 bg-transparent text-base text-ch-text placeholder:text-ch-text-muted focus:outline-none min-h-[44px]"
            aria-label="Search records"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1.5 text-ch-text-secondary hover:text-ch-text rounded hover:bg-surface-muted min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="Clear query"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs border border-ch-border rounded text-ch-text-secondary hover:bg-surface-muted"
            aria-label="Close search"
          >
            ESC
          </button>
        </div>

        {/* Filter Tabs */}
        {query.trim().length > 0 && (
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-ch-border bg-surface overflow-x-auto text-xs shrink-0">
            {CATEGORY_TABS.map((tab) => {
              const count =
                tab.key === 'ALL'
                  ? searchResponse?.totalResults ?? 0
                  : searchResponse?.groups[tab.key]?.total ?? 0;
              const isActive = activeCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  className={cn(
                    'px-2.5 py-1 rounded-control whitespace-nowrap flex items-center gap-1.5 font-medium border min-h-[32px]',
                    isActive
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'bg-surface-muted text-ch-text-secondary border-ch-border hover:bg-surface-elevated',
                  )}
                >
                  <span>{tab.label}</span>
                  {searchResponse && (
                    <span
                      className={cn(
                        'px-1 py-0.2 rounded text-[10px]',
                        isActive ? 'bg-white/20 text-white' : 'bg-surface border border-ch-border',
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Search Content Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-ch-border">
          {/* Loading state */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-ch-text-secondary">
              <span className="text-sm font-medium">Searching workspace records...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-6 text-center text-red-500 text-sm">
              <p>Failed to load search results: {error}</p>
            </div>
          )}

          {/* Recent Searches (when query is empty) */}
          {!query.trim() && !loading && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={14} /> Recent Searches
                </span>
                {recentSearches.length > 0 && (
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-ch-primary hover:underline"
                  >
                    Clear Recent
                  </button>
                )}
              </div>
              {recentSearches.length > 0 ? (
                <div className="space-y-1">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-control text-sm text-ch-text hover:bg-surface-muted flex items-center justify-between min-h-[44px]"
                    >
                      <span className="flex items-center gap-2">
                        <Clock size={14} className="text-ch-text-muted" />
                        {term}
                      </span>
                      <ArrowRight size={14} className="text-ch-text-muted" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ch-text-muted py-4 text-center">
                  Type a keyword to search tasks, campaigns, CRM leads, meetings, goals, and assets.
                </p>
              )}
            </div>
          )}

          {/* Empty Results with Quick Actions */}
          {!loading && query.trim() && searchResponse && displayedItems.length === 0 && (
            <div className="py-12 px-6 text-center">
              <p className="text-sm font-medium text-ch-text">
                No matching records found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-ch-text-muted mt-1">
                Workspace scope: {currentWorkspace?.name}
              </p>
              {onOpenCreate && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCreate(SearchEntityType.TASK);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-control border border-ch-border bg-surface-muted hover:bg-surface-elevated text-ch-text min-h-[40px]"
                  >
                    <PlusCircle size={14} className="text-ch-primary" />
                    Create Task
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCreate(SearchEntityType.CRM);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-control border border-ch-border bg-surface-muted hover:bg-surface-elevated text-ch-text min-h-[40px]"
                  >
                    <PlusCircle size={14} className="text-ch-primary" />
                    Create CRM Lead
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results List */}
          {!loading && displayedItems.length > 0 && (
            <div className="p-2 space-y-1">
              {displayedItems.map((item, index) => {
                const isSelected = index === activeIndex;
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      'w-full text-left p-3 rounded-control flex items-start gap-3 border text-sm min-h-[44px]',
                      isSelected
                        ? 'bg-accent/10 border-accent'
                        : 'border-transparent hover:bg-surface-muted',
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="mt-0.5">{getEntityIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-ch-text truncate">{item.title}</span>
                        {item.badge && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-ch-border bg-surface-muted text-ch-text-secondary shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-ch-text-secondary truncate mt-0.5">
                        {item.subtitle}
                      </div>
                      {item.summary && (
                        <div className="text-xs text-ch-text-muted line-clamp-1 mt-0.5">
                          {item.summary}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="hidden sm:flex items-center justify-between px-4 py-2 border-t border-ch-border bg-surface-muted/40 text-[11px] text-ch-text-muted shrink-0">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 border border-ch-border rounded bg-surface text-ch-text font-mono text-[10px]">
                ↑
              </kbd>{' '}
              <kbd className="px-1 py-0.5 border border-ch-border rounded bg-surface text-ch-text font-mono text-[10px]">
                ↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 border border-ch-border rounded bg-surface text-ch-text font-mono text-[10px]">
                ↵
              </kbd>{' '}
              Open
            </span>
            <span>
              <kbd className="px-1 py-0.5 border border-ch-border rounded bg-surface text-ch-text font-mono text-[10px]">
                ESC
              </kbd>{' '}
              Dismiss
            </span>
          </div>
          <div>Workspace Scoped ({currentWorkspace?.slug})</div>
        </div>
      </div>
    </div>
  );
}
