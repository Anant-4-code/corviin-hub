export interface PresignedUploadResult {
  uploadUrl: string;
  storageKey: string;
  expiresAt: string;
  headers?: Record<string, string>;
}

export interface PresignedDownloadResult {
  downloadUrl: string;
  expiresAt: string;
}

export interface ObjectMetadata {
  sizeBytes: number;
  contentType: string;
  etag?: string;
  lastModified?: Date;
}

export interface ObjectStorageProvider {
  /**
   * Generate presigned PUT URL for client-direct upload to Cloudflare R2
   */
  createUploadUrl(
    storageKey: string,
    contentType: string,
    expiresInSeconds?: number,
  ): Promise<PresignedUploadResult>;

  /**
   * Generate presigned GET URL for secure downloading from Cloudflare R2
   */
  createDownloadUrl(
    storageKey: string,
    expiresInSeconds?: number,
  ): Promise<PresignedDownloadResult>;

  /**
   * Delete an object from Cloudflare R2
   */
  deleteObject(storageKey: string): Promise<void>;

  /**
   * Check if an object exists in Cloudflare R2
   */
  objectExists(storageKey: string): Promise<boolean>;

  /**
   * Retrieve object metadata from Cloudflare R2
   */
  getObjectMetadata(storageKey: string): Promise<ObjectMetadata | null>;
}

export const OBJECT_STORAGE_PROVIDER = 'OBJECT_STORAGE_PROVIDER';

