import React, { useState } from 'react';
import { TaskItem, TaskPriority, TaskStatus, CampaignStage } from '@corviin-hub/shared';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Dialog } from '@/components/ui/Dialog';
import { CheckSquare, Plus, Clock, User, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface MemberOption {
  id: string;
  displayName: string;
}

interface CampaignTasksTabProps {
  tasks: TaskItem[];
  campaignStage: CampaignStage;
  members: MemberOption[];
  onAddTask: (dto: { title: string; assigneeId?: string; priority?: TaskPriority; deadline?: string; stage: CampaignStage }) => Promise<void>;
  onToggleTaskStatus: (taskId: string, currentStatus: TaskStatus) => Promise<void>;
}

export function CampaignTasksTab({
  tasks,
  campaignStage,
  members,
  onAddTask,
  onToggleTaskStatus,
}: CampaignTasksTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState(() => members[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.HIGH);
  const [deadline, setDeadline] = useState(() => new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddTask({
        title: title.trim(),
        assigneeId: assigneeId || undefined,
        priority,
        deadline: deadline ? `${deadline}T18:00:00.000Z` : undefined,
        stage: campaignStage,
      });
      setIsDialogOpen(false);
      setTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMemberName = (id?: string) => {
    const m = members.find((mem) => mem.id === id);
    return m ? m.displayName : 'Unassigned';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-ch-border">
        <div>
          <h3 className="text-sm font-bold text-ch-text-primary flex items-center gap-1.5">
            <CheckSquare size={16} className="text-primary" />
            Stage Tasks (Shared Task Engine)
          </h3>
          <p className="text-xs text-ch-text-secondary mt-0.5">
            Tasks created here appear in My Tasks, All Tasks, and Team Task Calendar with bidirectional sync.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className="text-xs h-8 gap-1.5"
        >
          <Plus size={14} />
          <span>Add Stage Task</span>
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 border border-ch-border bg-surface text-xs text-ch-text-secondary">
          No tasks linked to this campaign yet. Create tasks for research, scripting, filming, or editing.
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const isCompleted = task.status === TaskStatus.COMPLETED;
            const isOverdue =
              task.deadline && new Date(task.deadline) < new Date() && !isCompleted;

            return (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 border bg-surface text-xs transition-none ${
                  isOverdue ? 'border-danger/40 bg-danger/[0.02]' : 'border-ch-border'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggleTaskStatus(task.id, task.status)}
                    className="w-4 h-4 rounded-none accent-primary cursor-pointer shrink-0"
                    aria-label={`Toggle task ${task.title}`}
                  />
                  <div className="min-w-0">
                    <span
                      className={`font-semibold block truncate ${
                        isCompleted ? 'line-through text-ch-text-muted' : 'text-ch-text-primary'
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-ch-text-muted mt-0.5">
                      <span className="flex items-center gap-1">
                        <User size={11} /> {getMemberName(task.assigneeId)}
                      </span>
                      {task.deadline && (
                        <span className="flex items-center gap-1 font-mono">
                          <Clock size={11} /> {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={isCompleted ? 'success' : isOverdue ? 'danger' : 'primary'}>
                    {task.status}
                  </Badge>
                  <span className="text-[10px] uppercase font-mono text-ch-text-muted font-bold">
                    {task.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Add Campaign Task"
        description="Generates an actionable record in the shared task engine."
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <FormField label="Task Title *" required>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Conduct script review with Rohit..."
              required
              className="text-xs"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Assignee">
              <Select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="text-xs"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.displayName}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Priority">
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="text-xs"
              >
                <option value={TaskPriority.URGENT}>Urgent</option>
                <option value={TaskPriority.HIGH}>High</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.LOW}>Low</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Target Deadline">
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="text-xs font-mono"
            />
          </FormField>

          <div className="pt-3 border-t border-ch-border flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Shared Task'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

