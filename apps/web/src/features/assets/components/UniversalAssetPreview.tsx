import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  FolderInput,
  Edit2,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCw,
  Copy,
  Check,
  FileText,
  FileSpreadsheet,
  Film,
  Music,
  Image as ImageIcon,
  File,
  AlertCircle,
  ExternalLink,
  Layers,
  Link2,
} from 'lucide-react';
import { AssetItem, AssetVersion, AssetRelationship } from '@corviin-hub/shared';
import { fetchAuthorizedDownload } from '@/services/assets';

interface UniversalAssetPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  asset: AssetItem | null;
  workspaceId: string;
  onMove?: (asset: AssetItem) => void;
  onRename?: (asset: AssetItem) => void;
  onDelete?: (asset: AssetItem) => void;
}

export const UniversalAssetPreview: React.FC<UniversalAssetPreviewProps> = ({
  isOpen,
  onClose,
  asset,
  workspaceId,
  onMove,
  onRename,
  onDelete,
}) => {
  const [downloadData, setDownloadData] = useState<{
    downloadUrl: string;
    previewUrl: string;
  } | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Viewer Controls State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [activeTab, setActiveTab] = useState<'preview' | 'metadata' | 'linked' | 'versions'>('preview');
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch short-lived signed URLs on modal open
  useEffect(() => {
    if (isOpen && asset) {
      setIsLoadingUrl(true);
      setError(null);
      setZoomLevel(1);
      setRotation(0);
      setActiveTab('preview');

      fetchAuthorizedDownload(workspaceId, asset.id)
        .then((res) => {
          setDownloadData({
            downloadUrl: res.downloadUrl,
            previewUrl: res.previewUrl || res.downloadUrl,
          });
        })
        .catch((err) => {
          setError(err?.message || 'Failed to generate secure preview link.');
        })
        .finally(() => {
          setIsLoadingUrl(false);
        });
    } else {
      setDownloadData(null);
    }
  }, [isOpen, asset, workspaceId]);

  if (!isOpen || !asset) return null;

  const mime = asset.mimeType.toLowerCase();
  const originalName = (asset.originalFileName || '').toLowerCase();
  const isImage = mime.startsWith('image/');
  const isPdf = mime === 'application/pdf';
  const isVideo = mime.startsWith('video/');
  const isAudio = mime.startsWith('audio/');
  const isTextOrCode =
    mime.startsWith('text/') ||
    mime.includes('json') ||
    mime.includes('javascript') ||
    mime.includes('typescript') ||
    mime.includes('xml') ||
    originalName.endsWith('.md') ||
    originalName.endsWith('.csv');
  const isOfficeDoc =
    mime.includes('officedocument') ||
    mime.includes('msword') ||
    mime.includes('msexcel') ||
    mime.includes('powerpoint') ||
    originalName.endsWith('.docx') ||
    originalName.endsWith('.xlsx') ||
    originalName.endsWith('.pptx');

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleCopyLink = () => {
    if (downloadData?.downloadUrl) {
      navigator.clipboard.writeText(downloadData.downloadUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col overflow-hidden text-ch-text-primary">
      {/* Top Header Bar */}
      <header className="h-14 bg-surface border-b border-ch-border flex items-center justify-between px-4 shrink-0 select-none">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded bg-surface-muted text-accent shrink-0">
            {isImage && <ImageIcon size={18} />}
            {isPdf && <FileText size={18} />}
            {isVideo && <Film size={18} />}
            {isAudio && <Music size={18} />}
            {isOfficeDoc && <FileSpreadsheet size={18} />}
            {!isImage && !isPdf && !isVideo && !isAudio && !isOfficeDoc && <File size={18} />}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-ch-text-primary truncate">
              {asset.title}
            </h2>
            <p className="text-xs text-ch-text-muted truncate">
              {asset.originalFileName} • {formatBytes(asset.sizeBytes)} • {asset.folderName || 'Root Storage'}
            </p>
          </div>
        </div>

        {/* Header Tabs */}
        <div className="hidden sm:flex items-center gap-1 bg-surface-muted p-1 rounded-lg border border-ch-border">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded text-xs font-medium transition-none ${
              activeTab === 'preview' ? 'bg-surface text-ch-text-primary shadow-sm font-semibold' : 'text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`px-3 py-1 rounded text-xs font-medium transition-none ${
              activeTab === 'metadata' ? 'bg-surface text-ch-text-primary shadow-sm font-semibold' : 'text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('linked')}
            className={`px-3 py-1 rounded text-xs font-medium transition-none ${
              activeTab === 'linked' ? 'bg-surface text-ch-text-primary shadow-sm font-semibold' : 'text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Linked ({asset.relationships.length})
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`px-3 py-1 rounded text-xs font-medium transition-none ${
              activeTab === 'versions' ? 'bg-surface text-ch-text-primary shadow-sm font-semibold' : 'text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Versions ({asset.versions.length})
          </button>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          {downloadData?.downloadUrl && (
            <a
              href={downloadData.downloadUrl}
              download={asset.originalFileName}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition-none"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Download</span>
            </a>
          )}

          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-muted rounded-control text-ch-text-secondary hover:text-ch-text-primary transition-none"
            title="Close Preview"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative bg-canvas">
        {/* Mobile View Tab Switcher */}
        <div className="flex sm:hidden border-b border-ch-border bg-surface text-xs divide-x divide-ch-border">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 font-medium ${activeTab === 'preview' ? 'text-accent font-semibold' : 'text-ch-text-secondary'}`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`flex-1 py-2 font-medium ${activeTab === 'metadata' ? 'text-accent font-semibold' : 'text-ch-text-secondary'}`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('linked')}
            className={`flex-1 py-2 font-medium ${activeTab === 'linked' ? 'text-accent font-semibold' : 'text-ch-text-secondary'}`}
          >
            Linked ({asset.relationships.length})
          </button>
        </div>

        {/* Primary Viewer Area */}
        <div className={`flex-1 overflow-auto flex flex-col items-center justify-center p-4 relative ${activeTab !== 'preview' ? 'hidden sm:flex' : 'flex'}`}>
          {isLoadingUrl && (
            <div className="text-center p-8 text-ch-text-secondary">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm">Generating authorized preview session…</p>
            </div>
          )}

          {error && (
            <div className="max-w-md p-6 bg-surface border border-danger/30 rounded-xl text-center">
              <AlertCircle size={28} className="text-danger mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-ch-text-primary mb-1">Preview Unavailable</h3>
              <p className="text-xs text-ch-text-secondary mb-4">{error}</p>
              {downloadData?.downloadUrl && (
                <a
                  href={downloadData.downloadUrl}
                  download={asset.originalFileName}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-accent-foreground rounded-control text-xs font-medium"
                >
                  <Download size={14} />
                  Download File Directly
                </a>
              )}
            </div>
          )}

          {!isLoadingUrl && !error && downloadData && (
            <>
              {/* IMAGE VIEWER */}
              {isImage && (
                <div className="flex-1 w-full h-full flex flex-col items-center justify-center overflow-hidden relative">
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-surface/90 border border-ch-border p-1 rounded-lg backdrop-blur shadow-sm">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                      className="p-1 hover:bg-surface-muted rounded text-ch-text-secondary hover:text-ch-text-primary"
                      title="Zoom Out"
                    >
                      <ZoomOut size={15} />
                    </button>
                    <span className="text-[11px] font-mono px-1 min-w-[40px] text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                      className="p-1 hover:bg-surface-muted rounded text-ch-text-secondary hover:text-ch-text-primary"
                      title="Zoom In"
                    >
                      <ZoomIn size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setZoomLevel(1);
                        setRotation(0);
                      }}
                      className="p-1 hover:bg-surface-muted rounded text-ch-text-secondary hover:text-ch-text-primary text-[11px] font-medium"
                      title="Reset"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="p-1 hover:bg-surface-muted rounded text-ch-text-secondary hover:text-ch-text-primary"
                      title="Rotate 90°"
                    >
                      <RotateCw size={15} />
                    </button>
                  </div>

                  <div className="flex-1 w-full flex items-center justify-center overflow-auto p-4">
                    <img
                      src={asset.previewUrl || downloadData.previewUrl}
                      alt={asset.title}
                      className="max-h-full max-w-full object-contain rounded-lg border border-ch-border shadow-lg transition-none"
                      style={{
                        transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* PDF VIEWER */}
              {isPdf && (
                <div className="w-full h-full flex flex-col rounded-xl overflow-hidden border border-ch-border bg-surface">
                  <div className="p-2 border-b border-ch-border flex items-center justify-between text-xs bg-surface-muted">
                    <span className="font-semibold text-ch-text-primary">PDF Document Preview</span>
                    <a
                      href={downloadData.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-accent hover:underline text-xs"
                    >
                      <span>Open in Browser Tab</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <iframe
                    src={downloadData.previewUrl}
                    title={asset.title}
                    className="flex-1 w-full h-full border-0"
                  />
                </div>
              )}

              {/* VIDEO VIEWER */}
              {isVideo && (
                <div className="max-w-4xl w-full flex flex-col items-center justify-center p-4">
                  <video
                    controls
                    autoPlay={false}
                    className="w-full max-h-[75vh] rounded-xl border border-ch-border shadow-2xl bg-black"
                  >
                    <source src={downloadData.previewUrl} type={asset.mimeType} />
                    Your browser does not support HTML5 video playback.
                  </video>
                </div>
              )}

              {/* AUDIO VIEWER */}
              {isAudio && (
                <div className="w-full max-w-md p-6 bg-surface border border-ch-border rounded-xl shadow-lg text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto">
                    <Music size={28} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ch-text-primary">{asset.title}</h3>
                    <p className="text-xs text-ch-text-muted mt-0.5">{asset.originalFileName}</p>
                  </div>
                  <audio controls className="w-full mt-2">
                    <source src={downloadData.previewUrl} type={asset.mimeType} />
                    Your browser does not support audio playback.
                  </audio>
                </div>
              )}

              {/* TEXT / CODE VIEWER */}
              {isTextOrCode && (
                <div className="w-full h-full max-w-4xl flex flex-col bg-surface border border-ch-border rounded-xl overflow-hidden">
                  <div className="p-2.5 bg-surface-muted border-b border-ch-border flex items-center justify-between text-xs">
                    <span className="font-mono text-ch-text-secondary">{asset.originalFileName}</span>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1 text-ch-text-secondary hover:text-ch-text-primary"
                    >
                      {copiedLink ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                      <span>{copiedLink ? 'Copied' : 'Copy Content Link'}</span>
                    </button>
                  </div>
                  <iframe
                    src={downloadData.previewUrl}
                    title={asset.title}
                    className="flex-1 w-full h-full bg-surface p-4 font-mono text-xs border-0"
                  />
                </div>
              )}

              {/* OFFICE DOCUMENT FALLBACK */}
              {isOfficeDoc && (
                <div className="max-w-md w-full p-8 bg-surface border border-ch-border rounded-xl text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mx-auto">
                    <FileSpreadsheet size={32} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ch-text-primary">{asset.title}</h3>
                    <p className="text-xs text-ch-text-muted mt-1">
                      Microsoft Office document ({asset.originalFileName})
                    </p>
                  </div>
                  <div className="p-3 bg-surface-muted rounded-lg border border-ch-border text-xs text-ch-text-secondary">
                    Due to browser security policies, Office documents (.docx, .xlsx, .pptx) are downloaded for native editing.
                  </div>
                  <a
                    href={downloadData.downloadUrl}
                    download={asset.originalFileName}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-accent text-accent-foreground font-semibold rounded-control text-xs hover:opacity-90"
                  >
                    <Download size={14} />
                    Download {formatBytes(asset.sizeBytes)} File
                  </a>
                </div>
              )}

              {/* GENERIC UNSUPPORTED FORMAT */}
              {!isImage && !isPdf && !isVideo && !isAudio && !isTextOrCode && !isOfficeDoc && (
                <div className="max-w-md w-full p-8 bg-surface border border-ch-border rounded-xl text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-surface-muted border border-ch-border text-ch-text-secondary flex items-center justify-center mx-auto">
                    <File size={32} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ch-text-primary">{asset.title}</h3>
                    <p className="text-xs text-ch-text-muted mt-1">
                      {asset.originalFileName} • {asset.mimeType}
                    </p>
                  </div>
                  <p className="text-xs text-ch-text-secondary">
                    In-browser visual preview is not supported for this file format. You can securely download and view it locally.
                  </p>
                  <a
                    href={downloadData.downloadUrl}
                    download={asset.originalFileName}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-accent text-accent-foreground font-semibold rounded-control text-xs hover:opacity-90"
                  >
                    <Download size={14} />
                    Download File ({formatBytes(asset.sizeBytes)})
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Details & Metadata Sidebar */}
        <div
          className={`w-full lg:w-80 bg-surface border-l border-ch-border p-4 flex flex-col justify-between overflow-y-auto ${
            activeTab === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="space-y-5">
            {/* Folder Location & Category */}
            <div>
              <span className="text-[11px] font-semibold text-ch-text-muted uppercase tracking-wider">
                Folder Location
              </span>
              <div className="mt-1 flex items-center gap-1.5 p-2 rounded bg-surface-muted border border-ch-border text-xs text-ch-text-primary font-medium">
                <FolderInput size={14} className="text-accent shrink-0" />
                <span className="truncate">{asset.folderName || 'Root Storage'}</span>
              </div>
            </div>

            {/* Core Metadata */}
            <div>
              <span className="text-[11px] font-semibold text-ch-text-muted uppercase tracking-wider">
                File Information
              </span>
              <div className="mt-2 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-ch-border">
                  <span className="text-ch-text-secondary">Category</span>
                  <span className="font-semibold text-ch-text-primary capitalize">{(asset.category || '').toLowerCase().replace(/_/g, ' ') || 'General'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ch-border">
                  <span className="text-ch-text-secondary">Size</span>
                  <span className="font-mono text-ch-text-primary">{formatBytes(asset.sizeBytes)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ch-border">
                  <span className="text-ch-text-secondary">MIME Type</span>
                  <span className="font-mono text-ch-text-primary truncate max-w-[150px]">{asset.mimeType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ch-border">
                  <span className="text-ch-text-secondary">Uploaded By</span>
                  <span className="font-medium text-ch-text-primary">{asset.uploaderName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ch-border">
                  <span className="text-ch-text-secondary">Date</span>
                  <span className="text-ch-text-primary">{new Date(asset.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Linked Records Section (Section 10) */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-ch-text-muted uppercase tracking-wider">
                  Linked Operational Records
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-muted text-ch-text-muted">
                  {asset.relationships.length}
                </span>
              </div>

              <div className="mt-2 space-y-1.5">
                {asset.relationships.map((rel) => (
                  <div
                    key={rel.id}
                    className="p-2 rounded bg-surface-muted border border-ch-border text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Link2 size={12} className="text-accent shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-ch-text-primary truncate">{rel.relatedTitle}</p>
                        <p className="text-[10px] text-ch-text-muted uppercase tracking-wide">
                          {rel.relatedType.replace(/_/g, ' ')} {rel.stage ? `• ${rel.stage}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {asset.relationships.length === 0 && (
                  <p className="text-xs text-ch-text-muted italic p-2 bg-surface-muted rounded border border-ch-border">
                    Not linked to any campaigns, meetings, tasks, or CRM records yet.
                  </p>
                )}
              </div>
            </div>

            {/* Version History Section */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-ch-text-muted uppercase tracking-wider">
                  Version History
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-muted text-ch-text-muted">
                  v{asset.currentVersionNumber}
                </span>
              </div>

              <div className="mt-2 space-y-1 text-xs">
                {asset.versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-2 rounded border border-ch-border bg-surface-muted text-xs flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-ch-text-primary">v{ver.versionNumber} • {ver.fileName}</p>
                      <p className="text-[10px] text-ch-text-muted">{ver.changeNote || 'Standard upload'}</p>
                    </div>
                    <span className="text-[10px] text-ch-text-muted font-mono">
                      {new Date(ver.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="pt-4 mt-4 border-t border-ch-border space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onMove?.(asset)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-ch-border rounded-control bg-surface hover:bg-surface-muted text-xs font-medium text-ch-text-primary"
              >
                <FolderInput size={13} className="text-accent" />
                <span>Move Folder</span>
              </button>

              <button
                type="button"
                onClick={() => onRename?.(asset)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-ch-border rounded-control bg-surface hover:bg-surface-muted text-xs font-medium text-ch-text-primary"
              >
                <Edit2 size={13} className="text-ch-text-secondary" />
                <span>Rename</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onDelete?.(asset)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-danger/20 rounded-control bg-danger/10 hover:bg-danger/20 text-xs font-medium text-danger"
            >
              <Trash2 size={13} />
              <span>Delete Asset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
