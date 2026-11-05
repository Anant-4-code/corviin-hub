import { useState } from 'react';
import {
  Sun,
  Moon,
  Laptop,
  CheckCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  Paperclip,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Select,
  Textarea,
  FormField,
  FormSection,
  SearchInput,
  StatusBadge,
  PriorityIndicator,
  Avatar,
  Tabs,
  DataTable,
  ResponsiveRecordList,
  ActivityTimeline,
  Pagination,
  Dialog,
  ConfirmDialog,
  Drawer,
  BottomSheet,
  FilterBar,
  FilterSheet,
  FileUploader,
  Breadcrumbs,
  EmptyState,
  SearchEmptyState,
  FilterEmptyState,
  LoadingState,
  LoadingSkeleton,
  ErrorState,
  PermissionDeniedState,
  OfflineState,
  useToast,
  CommentComposer,
  AttachmentList,
  DateTimeField,
  MemberPicker,
  RelatedRecordPicker,
  ResponsiveDetailLayout,
  type ActiveFilter,
  type AttachmentItem,
  type RelatedRecordItem,
} from '@/components/ui';
import { useTheme } from '@/app/providers/ThemeProvider';

interface DemoRecord {
  id: string;
  title: string;
  category: string;
  status: 'Active' | 'Pending' | 'Completed' | 'Blocked';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignee: string;
  dueDate: string;
}

const DEMO_RECORDS: DemoRecord[] = [
  {
    id: 'rec-001',
    title: 'Finalize Tech client project scope',
    category: 'Tech Operations',
    status: 'Active',
    priority: 'HIGH',
    assignee: 'Anant',
    dueDate: 'Nov 12, 2026',
  },
  {
    id: 'rec-002',
    title: 'Site visit for Skyview Luxury Villa',
    category: 'Real Estate Sales',
    status: 'Pending',
    priority: 'URGENT',
    assignee: 'Rohit',
    dueDate: 'Nov 08, 2026',
  },
  {
    id: 'rec-003',
    title: 'Upload promotional video raw clips',
    category: 'Campaign Production',
    status: 'Completed',
    priority: 'MEDIUM',
    assignee: 'Utkarsh',
    dueDate: 'Nov 04, 2026',
  },
  {
    id: 'rec-004',
    title: 'Partner agreement legal review',
    category: 'Legal & Compliance',
    status: 'Blocked',
    priority: 'LOW',
    assignee: 'Anant',
    dueDate: 'Nov 18, 2026',
  },
];

const DEMO_MEMBERS = [
  { id: 'usr-1', name: 'Anant', role: 'Technical Lead & Architecture', email: 'anant@corviin.com' },
  { id: 'usr-2', name: 'Rohit', role: 'Real Estate Strategy & Operations', email: 'rohit@corviin.com' },
  { id: 'usr-3', name: 'Utkarsh', role: 'Creative Director & Campaigns', email: 'utkarsh@corviin.com' },
  { id: 'usr-4', name: 'Priya Sharma', role: 'Client Relations Associate', email: 'priya@corviin.com' },
];

const DEMO_RELATED_RECORDS: RelatedRecordItem[] = [
  { id: 'tsk-101', title: 'Prepare frontend skeleton documentation', type: 'task', subtitle: 'Work Module' },
  { id: 'cmp-201', title: 'Skyview Luxury Villa Campaign', type: 'campaign', subtitle: '5-Stage Production' },
  { id: 'mtg-301', title: 'Commercial Developer Discovery Call', type: 'meeting', subtitle: 'RE Partners' },
  { id: 'crm-401', title: 'Apex Real Estate Holdings Enquiry', type: 'crm', subtitle: 'Lead ID: CR-883' },
  { id: 'gol-501', title: 'Q4 Real Estate Pipeline Target', type: 'goal', subtitle: 'Target: ₹5 Cr' },
];

const INITIAL_ATTACHMENTS: AttachmentItem[] = [
  {
    id: 'att-1',
    name: 'villa_site_elevation_plan.pdf',
    size: 4200000,
    type: 'document',
    uploadedAt: 'Today at 11:30 AM',
    uploaderName: 'Rohit',
  },
  {
    id: 'att-2',
    name: 'drone_exterior_preview_4k.mp4',
    size: 28500000,
    type: 'video',
    uploadedAt: 'Yesterday at 3:15 PM',
    uploaderName: 'Utkarsh',
  },
  {
    id: 'att-3',
    name: 'property_master_render.jpg',
    size: 1800000,
    type: 'image',
    uploadedAt: 'Nov 02, 2026',
    uploaderName: 'Utkarsh',
  },
];

export function DesignSystemPreviewPage() {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();

  // Component demonstration states
  const [activeTab, setActiveTab] = useState('buttons');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // Form picker states
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>('usr-1');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>('cmp-201');
  const [demoDate, setDemoDate] = useState('2026-11-15');
  const [demoTime, setDemoTime] = useState('14:30');
  const [attachments, setAttachments] = useState<AttachmentItem[]>(INITIAL_ATTACHMENTS);

  // Active filters demo
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
    { key: 'category', label: 'Category', value: 'Tech Operations' },
    { key: 'status', label: 'Status', value: 'Active' },
  ]);

  const removeFilter = (key: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.key !== key));
  };

  const resetFilters = () => {
    setActiveFilters([]);
  };

  const breadcrumbItems = [
    { label: 'Settings', href: '/app/settings' },
    { label: 'Design System & Primitives' },
  ];

  const tableColumns = [
    {
      key: 'title',
      header: 'Task / Record Title',
      render: (item: DemoRecord) => (
        <div>
          <p className="font-semibold text-ch-text-primary">{item.title}</p>
          <p className="text-xs text-ch-text-secondary">{item.category}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: DemoRecord) => {
        const typeMap: Record<DemoRecord['status'], 'success' | 'warning' | 'danger' | 'info'> = {
          Active: 'info',
          Pending: 'warning',
          Completed: 'success',
          Blocked: 'danger',
        };
        return <StatusBadge type={typeMap[item.status]} label={item.status} />;
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (item: DemoRecord) => <PriorityIndicator priority={item.priority} />,
    },
    {
      key: 'assignee',
      header: 'Assignee',
      render: (item: DemoRecord) => (
        <div className="flex items-center gap-2">
          <Avatar name={item.assignee} size="sm" />
          <span className="text-xs font-medium text-ch-text-primary">{item.assignee}</span>
        </div>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (item: DemoRecord) => (
        <span className="text-xs text-ch-text-secondary">{item.dueDate}</span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="space-y-2 border-b border-ch-border pb-6">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ch-text-primary">
              Shared UI/UX Design System Preview
            </h1>
            <p className="mt-1 text-sm text-ch-text-secondary max-w-3xl">
              Centralized inspection catalog for CORVIIN HUB interface primitives, design tokens,
              system states, and interactive patterns across both Light and Dark themes.
            </p>
          </div>

          {/* Quick Theme Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-muted border border-ch-border rounded-control shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-control text-xs flex items-center gap-1.5 font-medium ${
                theme === 'light'
                  ? 'bg-surface text-ch-text-primary shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary'
              }`}
              aria-label="Activate light theme"
            >
              <Sun size={14} /> Light
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-control text-xs flex items-center gap-1.5 font-medium ${
                theme === 'dark'
                  ? 'bg-surface text-ch-text-primary shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary'
              }`}
              aria-label="Activate dark theme"
            >
              <Moon size={14} /> Dark
            </button>
            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-1.5 rounded-control text-xs flex items-center gap-1.5 font-medium ${
                theme === 'system'
                  ? 'bg-surface text-ch-text-primary shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary'
              }`}
              aria-label="Activate system theme"
            >
              <Laptop size={14} /> System
            </button>
          </div>
        </div>
      </div>

      {/* Design System Rules Banner */}
      <div className="p-4 bg-surface border border-ch-border rounded-card grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded bg-accent/15 text-accent mt-0.5">
            <CheckCircle size={15} />
          </div>
          <div>
            <p className="font-semibold text-ch-text-primary">Zero Animation Guarantee</p>
            <p className="text-ch-text-secondary mt-0.5">
              All transitions, transforms, keyframes, and shimmers are strictly disabled. Interaction
              feedback is immediate and static.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded bg-accent/15 text-accent mt-0.5">
            <CheckCircle size={15} />
          </div>
          <div>
            <p className="font-semibold text-ch-text-primary">First-Class Theme Parity</p>
            <p className="text-ch-text-secondary mt-0.5">
              Both Light and Dark themes use semantic design tokens with WCAG 2.2 AA contrast
              compliance and surface hierarchy.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded bg-accent/15 text-accent mt-0.5">
            <CheckCircle size={15} />
          </div>
          <div>
            <p className="font-semibold text-ch-text-primary">Self-Explanatory UX</p>
            <p className="text-ch-text-secondary mt-0.5">
              Every component uses clear business labels, semantic accessibility attributes, and
              actionable next steps.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Preview Sections */}
      <Tabs
        tabs={[
          { id: 'tokens', label: 'Color Tokens & Typography' },
          { id: 'buttons', label: 'Buttons & Actions' },
          { id: 'forms', label: 'Forms & Pickers' },
          { id: 'badges', label: 'Badges & Indicators' },
          { id: 'data', label: 'Data Tables & Records' },
          { id: 'filters', label: 'Filters & Attachments' },
          { id: 'overlays', label: 'Dialogs & Feedback' },
          { id: 'layout', label: 'Responsive Detail Layout' },
          { id: 'states', label: 'System States' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* SECTION 1: DESIGN TOKENS & TYPOGRAPHY */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">
                Semantic Color Tokens (Active Theme: {theme})
              </h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase text-ch-text-secondary tracking-wider mb-3">
                  Surfaces & Backgrounds
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-control border border-ch-border bg-canvas">
                    <p className="font-semibold text-ch-text-primary">Canvas</p>
                    <p className="text-ch-text-muted mt-1">Application background</p>
                  </div>
                  <div className="p-3 rounded-control border border-ch-border bg-surface">
                    <p className="font-semibold text-ch-text-primary">Surface</p>
                    <p className="text-ch-text-muted mt-1">Primary cards & panels</p>
                  </div>
                  <div className="p-3 rounded-control border border-ch-border bg-surface-muted">
                    <p className="font-semibold text-ch-text-primary">Surface Muted</p>
                    <p className="text-ch-text-muted mt-1">Headers & toolbars</p>
                  </div>
                  <div className="p-3 rounded-control border border-ch-border bg-surface-selected">
                    <p className="font-semibold text-ch-text-primary">Surface Selected</p>
                    <p className="text-ch-text-muted mt-1">Active list items</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase text-ch-text-secondary tracking-wider mb-3">
                  Brand Accent & Status Colors
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3 rounded-control bg-accent text-accent-foreground">
                    <p className="font-semibold">Accent Primary</p>
                    <p className="text-xs opacity-80 mt-1">Action & brand focus</p>
                  </div>
                  <div className="p-3 rounded-control bg-success text-white">
                    <p className="font-semibold">Success</p>
                    <p className="text-xs opacity-80 mt-1">Approved, completed</p>
                  </div>
                  <div className="p-3 rounded-control bg-warning text-white">
                    <p className="font-semibold">Warning</p>
                    <p className="text-xs opacity-80 mt-1">Due soon, attention</p>
                  </div>
                  <div className="p-3 rounded-control bg-danger text-white">
                    <p className="font-semibold">Danger</p>
                    <p className="text-xs opacity-80 mt-1">Overdue, blocked, destructive</p>
                  </div>
                  <div className="p-3 rounded-control bg-info text-white">
                    <p className="font-semibold">Info</p>
                    <p className="text-xs opacity-80 mt-1">In progress, scheduled</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase text-ch-text-secondary tracking-wider mb-3">
                  Borders & Separators
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-control border border-ch-border bg-surface">
                    <p className="font-semibold text-ch-text-primary">Default Border (--color-border)</p>
                    <p className="text-ch-text-muted mt-1">Cards, tables, subtle dividers</p>
                  </div>
                  <div className="p-3 rounded-control border-2 border-ch-border-strong bg-surface">
                    <p className="font-semibold text-ch-text-primary">Strong Border (--color-border-strong)</p>
                    <p className="text-ch-text-muted mt-1">Input controls, active separators</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">Typography Scale</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="border-b border-ch-border pb-3">
                <span className="text-xs text-ch-text-muted">Page Title (24px - 28px / Semibold)</span>
                <p className="text-2xl font-bold text-ch-text-primary">Operations Executive Dashboard</p>
              </div>
              <div className="border-b border-ch-border pb-3">
                <span className="text-xs text-ch-text-muted">Section Title (18px - 20px / Semibold)</span>
                <p className="text-lg font-semibold text-ch-text-primary">Active Campaigns & Pipelines</p>
              </div>
              <div className="border-b border-ch-border pb-3">
                <span className="text-xs text-ch-text-muted">Card / Record Title (15px - 17px / Semibold)</span>
                <p className="text-base font-semibold text-ch-text-primary">Skyview Luxury Villa Promotion</p>
              </div>
              <div className="border-b border-ch-border pb-3">
                <span className="text-xs text-ch-text-muted">Standard Body (14px / Regular)</span>
                <p className="text-sm text-ch-text-primary">
                  Reviewing buyer feedback from the Sunday site visit. Action items converted to follow-up tasks.
                </p>
              </div>
              <div>
                <span className="text-xs text-ch-text-muted">Secondary & Metadata (12px - 13px / Regular)</span>
                <p className="text-xs text-ch-text-secondary">
                  Last updated 2 hours ago by Utkarsh • Scoped to Corviin Real Estate
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* SECTION 2: BUTTONS & ACTIONS */}
      {activeTab === 'buttons' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">Button Variants</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="outline">Outline Action</Button>
                <Button variant="ghost">Ghost Action</Button>
                <Button variant="danger">Destructive Action</Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">
                Button Sizes (with Accessible Touch Targets)
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" variant="secondary">
                  Small (34px)
                </Button>
                <Button size="md" variant="secondary">
                  Medium (40px standard)
                </Button>
                <Button size="lg" variant="primary">
                  Large (44px touch-target)
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">Button Interactive States</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  loading={btnLoading}
                  onClick={() => {
                    setBtnLoading(true);
                    setTimeout(() => setBtnLoading(false), 2000);
                  }}
                >
                  {btnLoading ? 'Processing…' : 'Click for Loading State'}
                </Button>
                <Button variant="secondary" disabled>
                  Disabled Secondary
                </Button>
                <Button variant="danger" disabled>
                  Disabled Danger
                </Button>
              </div>
              <p className="text-xs text-ch-text-secondary">
                Notice: Loading state uses a static spinner indicator with zero animation and clear text.
              </p>
            </CardBody>
          </Card>
        </div>
      )}

      {/* SECTION 3: FORMS & PICKERS */}
      {activeTab === 'forms' && (
        <div className="space-y-6">
          <FormSection
            title="Operational Record Form"
            description="All form controls have visible labels, clear error states, and optional helper text."
            columns={2}
          >
            <Input
              label="Task / Record Title"
              placeholder="e.g. Schedule project kickoff meeting"
              required
              helper="Be descriptive so assignees understand the deliverable immediately."
            />

            {/* MemberPicker Primitive */}
            <MemberPicker
              label="Assigned Team Member"
              selectedMemberId={selectedMemberId || undefined}
              onSelect={setSelectedMemberId}
              members={DEMO_MEMBERS}
              required
              helper="Dynamic member selector with initials avatar and role."
            />

            {/* RelatedRecordPicker Primitive */}
            <RelatedRecordPicker
              label="Link Related Record"
              selectedRecordId={selectedRecordId || undefined}
              onSelect={(rec) => setSelectedRecordId(rec ? rec.id : null)}
              records={DEMO_RELATED_RECORDS}
              helper="Link to a task, campaign, meeting or CRM record across the active workspace."
            />

            {/* DateTimeField Primitive */}
            <DateTimeField
              label="Target Delivery Date & Time"
              dateValue={demoDate}
              onDateChange={setDemoDate}
              timeValue={demoTime}
              onTimeChange={setDemoTime}
              includeTime
              required
              helper="Preserves planned schedule with explicit timezone indicator."
            />

            <Input
              label="Validation Error Example"
              defaultValue="invalid-email"
              error="Please provide a valid business email address."
              required
            />

            <Select
              label="Priority Level"
              options={[
                { value: 'urgent', label: 'Urgent — immediate intervention' },
                { value: 'high', label: 'High — due within 48 hours' },
                { value: 'medium', label: 'Medium — standard timeline' },
                { value: 'low', label: 'Low — backlog / opportunistic' },
              ]}
              defaultValue="high"
            />

            <div className="md:col-span-2">
              <Textarea
                label="Task Description & Context"
                rows={3}
                placeholder="Include agenda, links to reference assets, or success criteria..."
                helper="Provide enough context so the record is self-explanatory without training."
              />
            </div>
          </FormSection>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">Search Input Primitive</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="max-w-md">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search tasks, campaigns, meetings, contacts..."
                />
              </div>
              <p className="text-xs text-ch-text-secondary">
                Current query: <span className="font-medium text-ch-text-primary">"{searchQuery}"</span>
              </p>
            </CardBody>
          </Card>
        </div>
      )}

      {/* SECTION 4: BADGES & INDICATORS */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">Status Badges</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge type="success" label="Completed" />
                <StatusBadge type="warning" label="Pending Review" />
                <StatusBadge type="danger" label="Overdue" />
                <StatusBadge type="info" label="In Progress" />
                <StatusBadge type="neutral" label="Draft" />
              </div>
              <p className="text-xs text-ch-text-secondary">
                Statuses always include textual labels and clear semantic tokens. Color is never the sole indicator.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">Priority Indicators</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <PriorityIndicator priority="URGENT" />
                <PriorityIndicator priority="HIGH" />
                <PriorityIndicator priority="MEDIUM" />
                <PriorityIndicator priority="LOW" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">Member Avatars</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-center space-y-1">
                  <Avatar name="Anant" size="sm" />
                  <p className="text-[11px] text-ch-text-secondary">Small (28px)</p>
                </div>
                <div className="text-center space-y-1">
                  <Avatar name="Rohit" size="md" />
                  <p className="text-[11px] text-ch-text-secondary">Medium (32px)</p>
                </div>
                <div className="text-center space-y-1">
                  <Avatar name="Utkarsh" size="lg" />
                  <p className="text-[11px] text-ch-text-secondary">Large (40px)</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* SECTION 5: DATA TABLES & RECORDS */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <h2 className="text-sm font-semibold text-ch-text-primary">
                    Responsive Record List (Desktop Table / Mobile Card Stack)
                  </h2>
                  <p className="text-xs text-ch-text-secondary mt-0.5">
                    Renders an information-dense table on desktop and touch-friendly cards on mobile.
                  </p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => addToast({ type: 'info', message: 'Demo export triggered' })}>
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <ResponsiveRecordList
                columns={tableColumns}
                data={DEMO_RECORDS}
                keyExtractor={(item) => item.id}
                onItemClick={(item) => addToast({ type: 'info', message: `Clicked: ${item.title}` })}
                renderCard={(item) => (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm text-ch-text-primary">{item.title}</p>
                      <StatusBadge
                        type={item.status === 'Completed' ? 'success' : item.status === 'Blocked' ? 'danger' : 'info'}
                        label={item.status}
                      />
                    </div>
                    <p className="text-xs text-ch-text-secondary">{item.category}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-ch-border text-xs">
                      <PriorityIndicator priority={item.priority} />
                      <span className="text-ch-text-secondary">Due: {item.dueDate}</span>
                    </div>
                  </div>
                )}
              />
            </CardBody>
            <CardFooter>
              <Pagination
                page={currentPage}
                pageSize={10}
                total={DEMO_RECORDS.length}
                onPageChange={setCurrentPage}
                className="w-full"
              />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">Activity Timeline Primitive</h2>
            </CardHeader>
            <CardBody>
              <ActivityTimeline
                events={[
                  {
                    id: 'act-1',
                    actorName: 'Anant',
                    action: 'created task',
                    target: 'Finalize Tech client project scope',
                    timestamp: 'Today at 10:45 AM',
                    details: 'Assigned to self with high priority.',
                  },
                  {
                    id: 'act-2',
                    actorName: 'Utkarsh',
                    action: 'uploaded 3 assets to',
                    target: 'Skyview Luxury Villa Campaign',
                    timestamp: 'Yesterday at 4:20 PM',
                    details: 'Files: raw_cut_01.mp4, drone_exterior.jpg, script_v2.pdf',
                  },
                  {
                    id: 'act-3',
                    actorName: 'Rohit',
                    action: 'scheduled site visit with buyer',
                    target: 'Vikram Sharma',
                    timestamp: 'Nov 03, 2026',
                  },
                ]}
              />
            </CardBody>
          </Card>
        </div>
      )}

      {/* SECTION 6: FILTERS & ATTACHMENTS */}
      {activeTab === 'filters' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">
                FilterBar (Desktop Inline + Mobile Drawer Trigger)
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <FilterBar
                activeFilters={activeFilters}
                onRemoveFilter={removeFilter}
                onResetFilters={resetFilters}
                onOpenMobileFilters={() => setIsFilterSheetOpen(true)}
                searchSlot={
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search records…"
                  />
                }
                actionSlot={
                  <Button variant="primary" size="md">
                    <Plus size={15} /> Create Record
                  </Button>
                }
              >
                <select className="h-9 px-3 text-xs border border-ch-border rounded-control bg-surface text-ch-text-primary">
                  <option value="">All Categories</option>
                  <option value="tech">Tech Operations</option>
                  <option value="realestate">Real Estate</option>
                </select>
                <select className="h-9 px-3 text-xs border border-ch-border rounded-control bg-surface text-ch-text-primary">
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </FilterBar>

              <FilterSheet
                open={isFilterSheetOpen}
                onClose={() => setIsFilterSheetOpen(false)}
                activeCount={activeFilters.length}
                onApply={() => addToast({ type: 'success', message: 'Applied mobile filters' })}
                onReset={resetFilters}
              >
                <Select
                  label="Category"
                  options={[
                    { value: 'all', label: 'All Categories' },
                    { value: 'tech', label: 'Tech Operations' },
                    { value: 'realestate', label: 'Real Estate Sales' },
                  ]}
                />
                <Select
                  label="Status"
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'active', label: 'Active' },
                    { value: 'completed', label: 'Completed' },
                  ]}
                />
              </FilterSheet>
            </CardBody>
          </Card>

          {/* AttachmentList Primitive */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Paperclip size={16} className="text-accent" />
                  <h2 className="text-sm font-semibold text-ch-text-primary">
                    Attachment List Primitive
                  </h2>
                </div>
                <span className="text-xs text-ch-text-secondary">{attachments.length} files attached</span>
              </div>
            </CardHeader>
            <CardBody>
              <AttachmentList
                attachments={attachments}
                onDownload={(item) => addToast({ type: 'info', message: `Downloading ${item.name}` })}
                onRemove={(item) => {
                  setAttachments((prev) => prev.filter((a) => a.id !== item.id));
                  addToast({ type: 'warning', message: `Removed attachment link: ${item.name}` });
                }}
              />
            </CardBody>
          </Card>

          {/* FileUploader Primitive */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">
                File Uploader Primitive (Static Progress, No Animation)
              </h2>
            </CardHeader>
            <CardBody>
              <FileUploader
                accept="image/*,video/mp4,application/pdf"
                maxSizeMb={25}
                multiple
                destinationLabel="Uploaded assets are scoped to the active workspace asset library."
              />
            </CardBody>
          </Card>
        </div>
      )}

      {/* SECTION 7: OVERLAYS & FEEDBACK */}
      {activeTab === 'overlays' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">
                Modals, Drawers & Bottom Sheets
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
                  Open Standard Dialog
                </Button>
                <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
                  Open Destructive Confirm Dialog
                </Button>
                <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
                  Open Desktop Side Drawer
                </Button>
                <Button variant="secondary" onClick={() => setIsBottomSheetOpen(true)}>
                  Open Mobile Bottom Sheet
                </Button>
              </div>

              {/* Standard Dialog */}
              <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Quick Record Inspection"
                description="Standard dialog for focused information or short decision forms."
              >
                <p className="text-sm text-ch-text-secondary mb-4">
                  This dialog demonstrates immediate static opening without bounce or zoom effects.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={() => setIsDialogOpen(false)}>
                    Acknowledge
                  </Button>
                </div>
              </Dialog>

              {/* Confirm Dialog */}
              <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() =>
                  addToast({ type: 'error', message: 'Item permanently deleted' })
                }
                title="Delete Operational Record"
                description="Are you sure you want to delete this record? This action cannot be undone and linked tasks will be unassigned."
                confirmLabel="Delete record"
                danger
              />

              {/* Desktop Drawer */}
              <Drawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Record Details Panel"
                width="w-96"
              >
                <div className="space-y-4 text-sm text-ch-text-secondary">
                  <p>
                    Side drawer used for deep inspection of records on desktop screens without leaving the active table view.
                  </p>
                  <Button variant="secondary" onClick={() => setIsDrawerOpen(false)} className="w-full">
                    Done
                  </Button>
                </div>
              </Drawer>

              {/* Mobile Bottom Sheet */}
              <BottomSheet
                open={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                title="Quick Mobile Action"
              >
                <div className="space-y-4 text-sm text-ch-text-secondary">
                  <p>
                    Thumb-friendly bottom sheet for mobile and Android Capacitor views.
                  </p>
                  <Button variant="primary" onClick={() => setIsBottomSheetOpen(false)} className="w-full">
                    Close Sheet
                  </Button>
                </div>
              </BottomSheet>
            </CardBody>
          </Card>

          {/* CommentComposer Primitive */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">
                Comment Composer Primitive
              </h2>
            </CardHeader>
            <CardBody>
              <CommentComposer
                authorName="Anant"
                onSubmit={(text) =>
                  addToast({
                    type: 'success',
                    message: 'Comment posted',
                    description: `"${text}"`,
                  })
                }
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">Toast Feedback Notifications</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    addToast({
                      type: 'success',
                      message: 'Task saved successfully',
                      description: 'Changes synchronized to workspace Corviin Tech.',
                    })
                  }
                >
                  Trigger Success Toast
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    addToast({
                      type: 'warning',
                      message: 'Due date is today',
                      description: '3 pending items need attention before 6:00 PM.',
                    })
                  }
                >
                  Trigger Warning Toast
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    addToast({
                      type: 'error',
                      message: 'Could not upload file',
                      description: 'Network timeout. Your selected files were retained.',
                    })
                  }
                >
                  Trigger Error Toast
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    addToast({
                      type: 'info',
                      message: 'Workspace switched',
                      description: 'Now viewing Corviin Real Estate.',
                    })
                  }
                >
                  Trigger Info Toast
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* SECTION 8: RESPONSIVE DETAIL LAYOUT */}
      {activeTab === 'layout' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-sm font-semibold text-ch-text-primary">
                  Responsive Detail Layout Architecture
                </h2>
                <p className="text-xs text-ch-text-secondary mt-0.5">
                  Standard 2-column pattern for complex operational records: Left 67% (content, tabs, activity) and Right 33% (metadata, assignees, dates, actions).
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <ResponsiveDetailLayout
                header={
                  <div className="p-4 bg-surface border border-ch-border rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs text-accent font-semibold uppercase tracking-wider">
                        Campaign #CMP-2026-08
                      </span>
                      <h3 className="text-lg font-bold text-ch-text-primary">
                        Skyview Luxury Villa Promotion
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge type="warning" label="Scripting & Planning" />
                      <PriorityIndicator priority="HIGH" />
                    </div>
                  </div>
                }
                mainContent={
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <h4 className="text-xs font-semibold text-ch-text-primary">
                          Main Content Area (Tabs & Workspace)
                        </h4>
                      </CardHeader>
                      <CardBody className="space-y-3 text-sm text-ch-text-secondary">
                        <p>
                          Contains the campaign stage workspace, linked action items, and activity history.
                          On desktop, this area occupies 8 of 12 columns for comfortable reading density.
                        </p>
                        <CommentComposer
                          authorName="Utkarsh"
                          placeholder="Leave an internal production note…"
                          onSubmit={(text) => addToast({ type: 'info', message: text })}
                        />
                      </CardBody>
                    </Card>
                  </div>
                }
                sideContent={
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <h4 className="text-xs font-semibold text-ch-text-primary">
                          Record Metadata & Actions
                        </h4>
                      </CardHeader>
                      <CardBody className="space-y-3 text-xs">
                        <div>
                          <span className="text-ch-text-muted">Lead Owner</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar name="Rohit" size="sm" />
                            <span className="font-semibold text-ch-text-primary">Rohit (Real Estate)</span>
                          </div>
                        </div>
                        <div className="border-t border-ch-border pt-2">
                          <span className="text-ch-text-muted">Target Launch</span>
                          <p className="font-semibold text-ch-text-primary mt-0.5">November 20, 2026</p>
                        </div>
                        <div className="border-t border-ch-border pt-2">
                          <span className="text-ch-text-muted">Linked CRM Property</span>
                          <p className="font-semibold text-accent mt-0.5">Skyview Villas Phase 2</p>
                        </div>
                      </CardBody>
                      <CardFooter>
                        <Button variant="primary" size="sm" className="w-full">
                          Advance Stage
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                }
              />
            </CardBody>
          </Card>
        </div>
      )}

      {/* SECTION 9: SYSTEM STATES */}
      {activeTab === 'states' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ch-text-primary">
                Mandatory System States Catalog
              </h2>
            </CardHeader>
            <CardBody className="space-y-8">
              {/* Empty State */}
              <div>
                <h3 className="text-xs font-semibold uppercase text-ch-text-secondary mb-2">
                  1. Self-Explanatory Empty State
                </h3>
                <EmptyState
                  title="No tasks assigned yet"
                  description="You have no open tasks in Corviin Tech. Create a task or pick up unassigned items from the team backlog."
                  action={{
                    label: 'Create first task',
                    onClick: () => addToast({ type: 'info', message: 'Create task clicked' }),
                  }}
                  secondaryAction={{
                    label: 'View team backlog',
                    onClick: () => addToast({ type: 'info', message: 'Backlog clicked' }),
                  }}
                />
              </div>

              {/* Search Empty State */}
              <div>
                <h3 className="text-xs font-semibold uppercase text-ch-text-secondary mb-2">
                  2. Search Empty State
                </h3>
                <SearchEmptyState
                  query="nonexistent query"
                  onClear={() => addToast({ type: 'info', message: 'Query cleared' })}
                />
              </div>

              {/* Filter Empty State */}
              <div>
                <h3 className="text-xs font-semibold uppercase text-ch-text-secondary mb-2">
                  3. Filter Empty State
                </h3>
                <FilterEmptyState
                  onReset={() => addToast({ type: 'info', message: 'Filters reset' })}
                />
              </div>

              {/* Loading State & Skeleton */}
              <div>
                <h3 className="text-xs font-semibold uppercase text-ch-text-secondary mb-2">
                  4. Loading State & Static Skeleton (No shimmer/pulse)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-surface border border-ch-border rounded-card">
                    <LoadingState message="Fetching workspace tasks…" />
                  </div>
                  <LoadingSkeleton rows={3} />
                </div>
              </div>

              {/* Error State */}
              <div>
                <h3 className="text-xs font-semibold uppercase text-ch-text-secondary mb-2">
                  5. Error State with Recovery Guidance
                </h3>
                <ErrorState
                  title="Could not load campaign assets"
                  message="The server returned a 503 Service Unavailable error. Check your network or retry the request."
                  onRetry={() => addToast({ type: 'info', message: 'Retry initiated' })}
                />
              </div>

              {/* Permission Denied State */}
              <div>
                <h3 className="text-xs font-semibold uppercase text-ch-text-secondary mb-2">
                  6. Permission Denied State
                </h3>
                <PermissionDeniedState
                  workspaceName="Corviin Real Estate"
                  onSwitchWorkspace={() =>
                    addToast({ type: 'info', message: 'Switch workspace triggered' })
                  }
                />
              </div>

              {/* Offline State */}
              <div>
                <h3 className="text-xs font-semibold uppercase text-ch-text-secondary mb-2">
                  7. Offline Connection State
                </h3>
                <OfflineState
                  onRetry={() => addToast({ type: 'info', message: 'Connection re-checked' })}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
