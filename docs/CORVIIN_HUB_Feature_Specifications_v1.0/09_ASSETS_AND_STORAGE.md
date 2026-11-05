# CORVIIN HUB — Assets & Storage Feature Specification

**Document ID:** CH-FS-09 | **Version:** 1.0

## 1. Purpose

Provide a searchable, workspace-scoped file library for campaign material, business documents and operational attachments. The library stores metadata and relationships; file binaries live in private object storage.

## 2. Main page

Desktop:
- Page title and Upload action.
- Search.
- Filter toolbar.
- Optional grid/list switch.
- File table or thumbnail grid.
- Detail/preview panel.

Mobile:
- Search at top.
- Filter drawer.
- File cards with thumbnail/icon, name, category, date and uploader.
- Upload action easy to reach.
- Preview/detail opens full-screen.

## 3. Asset categories

- References/research
- Scripts/copy
- Raw footage
- Images/posters/designs
- Audio/voice-over
- Draft edits
- Final approved assets
- Published proof
- Contracts/business documents
- Other

Categories may be configured by workspace. Do not mix category labels between workspaces unless deliberately shared.

## 4. Asset metadata

Required or system-generated:
- Workspace
- Original filename
- File type/MIME
- Size
- Uploader
- Upload timestamp
- Storage key
- Category

Optional:
- Description
- Tags
- Campaign and campaign stage
- Project/client/CRM relationship
- Version note
- Related meeting/task/plan

## 5. Upload flow

1. User selects file.
2. User chooses category and optional links.
3. Client requests upload intent from API.
4. API validates membership, file policy and destination relationships.
5. API returns short-lived upload authorisation.
6. Client uploads to private storage.
7. Client confirms completion.
8. API verifies object and creates Asset/Version/Link records.
9. Activity event is recorded.

If initiated from a campaign, campaign relationship is preselected and automatically linked.

## 6. Upload UX

- Show file name, size and progress.
- Support multiple selection if configured.
- Allow cancel where safe.
- Provide retry for transient failures.
- Do not show success until server confirms asset registration.
- Preserve metadata form if upload fails.
- Explain rejected file type/size.
- For large video, use resumable/multipart upload if supported.

## 7. Search and filters

Search:
- Filename
- Description
- Tags
- Campaign title where indexed
- Linked client/project where supported

Filters:
- Category
- File type
- Campaign
- Stage
- Uploader
- Date uploaded
- Tag
- Linked entity

All queries must be workspace-scoped and paginated.

## 8. Preview and download

- Preview images and supported documents/media where safe.
- Unsupported format shows file metadata and Open/Download action.
- Use authorised short-lived download links.
- Do not expose permanent public bucket URLs for private files.
- Large media preview must not block the page.

## 9. Versions

- A replacement or revised upload creates a new version.
- Preserve prior versions.
- Show version number, uploader, timestamp and change note.
- Allow authorised download of earlier versions.
- Identify current version clearly.

## 10. Campaign relationship behaviour

- Campaign page filters assets to that campaign.
- Global library shows assets across the active workspace.
- One asset may have multiple explicit links.
- Removing a link does not delete the file.
- Permanent delete checks references, asks for confirmation and records audit.

## 11. Mobile UX

- Native file picker integration where available.
- Camera/gallery access only when permission is granted.
- Upload queue remains visible during navigation where practical.
- Avoid attempting to render very large unsupported previews.
- Use concise metadata entry.

## 12. Security and validation

- Private storage.
- Short-lived signed URLs.
- Validate size and allowed type on server.
- Do not trust filename or client MIME alone.
- Randomised storage keys.
- Consider malware scanning before production.
- Restrict download by workspace membership and record relationship.

## 13. Acceptance criteria

- [ ] Asset library is workspace-scoped.
- [ ] Search and filters are server-side and paginated.
- [ ] Upload progress and recoverable errors are visible.
- [ ] Campaign uploads auto-link.
- [ ] Versions are retained.
- [ ] Download requires authorisation.
- [ ] Removing a relationship does not delete the binary.
