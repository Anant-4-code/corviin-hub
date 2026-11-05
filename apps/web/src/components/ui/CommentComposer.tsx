import { useState, type KeyboardEvent } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from './Button';
import { Avatar } from './Avatar';

interface CommentComposerProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  loading?: boolean;
  authorName?: string;
  disabled?: boolean;
  className?: string;
}

export function CommentComposer({
  onSubmit,
  placeholder = 'Add a comment or update on this record…',
  loading = false,
  authorName,
  disabled = false,
  className,
}: CommentComposerProps) {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed || loading || disabled) return;
    onSubmit(trimmed);
    setContent('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn('p-3 bg-surface border border-ch-border rounded-card space-y-2.5', className)}>
      <div className="flex items-start gap-2.5">
        {authorName && <Avatar name={authorName} size="sm" className="mt-0.5 shrink-0" />}
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          placeholder={placeholder}
          className={cn(
            'w-full bg-transparent text-sm text-ch-text-primary placeholder:text-ch-text-muted',
            'focus:outline-none resize-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
          aria-label="Comment input"
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-ch-border text-xs text-ch-text-secondary">
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-ch-text-muted">
          <span>Press</span>
          <kbd className="px-1 py-0.5 bg-surface-muted border border-ch-border rounded text-[10px] font-mono">
            Ctrl + Enter
          </kbd>
          <span>to submit</span>
        </span>

        <div className="flex items-center gap-2 ml-auto">
          {content.trim().length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setContent('')}
              disabled={loading || disabled}
              className="text-xs h-8"
            >
              Clear
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim() || loading || disabled}
            loading={loading}
            className="gap-1.5 h-8 px-3"
            aria-label="Post comment"
          >
            <Send size={13} />
            <span>Post comment</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
