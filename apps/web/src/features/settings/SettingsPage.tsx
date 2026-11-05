import { ModulePlaceholder } from '@/components/ui/ModulePlaceholder';

export function SettingsPage() {
  return (
    <ModulePlaceholder
      title="Settings"
      description="Personal profile preferences and workspace configuration options."
      plannedSections={[
        {
          title: "Personal Preferences",
          description: "Active theme (Light / Dark / System), notification alerts, and acting profile details.",
        },
        {
          title: "Workspace Configuration",
          description: "Workspace name, branding tokens, pipeline stage customization, and category labels.",
        },
        {
          title: "Storage & System Information",
          description: "Private S3 asset usage quotas, API health status, and application build metadata.",
        },
      ]}
    />
  );
}
