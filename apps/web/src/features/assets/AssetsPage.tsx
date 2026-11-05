import { ModulePlaceholder } from '@/components/ui/ModulePlaceholder';

export function AssetsPage() {
  return (
    <ModulePlaceholder
      title="Assets & Storage"
      description="Central workspace media and document repository with private presigned S3/R2 storage."
      plannedSections={[
        {
          title: "All Media & Documents",
          description: "Filterable grid and table of images, video rushes, scripts, audio files, and contracts.",
        },
        {
          title: "Direct-to-Storage Upload Flow",
          description: "Client-side presigned URL upload pipeline for large video files without overloading backend memory.",
        },
        {
          title: "Campaign Relationships & Versioning",
          description: "Non-destructive unlinking: disassociating an asset from a campaign preserves the binary in storage.",
        },
      ]}
    />
  );
}
