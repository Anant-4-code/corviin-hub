import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import {
  ObjectStorageProvider,
  OBJECT_STORAGE_PROVIDER,
  PresignedUploadResult,
  PresignedDownloadResult,
  ObjectMetadata,
} from './object-storage.interface';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(
    @Inject(OBJECT_STORAGE_PROVIDER)
    private readonly storageProvider: ObjectStorageProvider,
  ) {}

  /**
   * Sanitize a file name for safe storage keys
   */
  sanitizeFilename(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  /**
   * Generate an isolated, structured storage key for a workspace asset
   * Format: workspaces/{workspaceId}/assets/{year}/{month}/{uniqueId}-{fileName}
   */
  buildStorageKey(
    workspaceId: string,
    fileName: string,
    uniquePrefix?: string,
  ): string {
    if (!workspaceId) {
      throw new BadRequestException('Workspace ID is required to build a storage key.');
    }
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const prefix =
      uniquePrefix ||
      `ast-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const sanitized = this.sanitizeFilename(fileName);

    return `workspaces/${workspaceId}/assets/${year}/${month}/${prefix}-${sanitized}`;
  }

  /**
   * Create a presigned upload URL for direct client-to-R2 uploads
   */
  async createUploadUrl(
    storageKey: string,
    contentType: string,
    expiresInSeconds = 900,
  ): Promise<PresignedUploadResult> {
    return this.storageProvider.createUploadUrl(
      storageKey,
      contentType,
      expiresInSeconds,
    );
  }

  /**
   * Create a presigned download URL for accessing an asset
   */
  async createDownloadUrl(
    storageKey: string,
    expiresInSeconds = 3600,
  ): Promise<PresignedDownloadResult> {
    return this.storageProvider.createDownloadUrl(storageKey, expiresInSeconds);
  }

  /**
   * Delete an object from storage
   */
  async deleteObject(storageKey: string): Promise<void> {
    return this.storageProvider.deleteObject(storageKey);
  }

  /**
   * Verify if an object exists in storage
   */
  async objectExists(storageKey: string): Promise<boolean> {
    return this.storageProvider.objectExists(storageKey);
  }

  /**
   * Retrieve metadata for a stored object
   */
  async getObjectMetadata(storageKey: string): Promise<ObjectMetadata | null> {
    return this.storageProvider.getObjectMetadata(storageKey);
  }

  /**
   * Safe retry wrapper with exponential backoff for transient network operations
   */
  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    initialDelayMs = 200,
  ): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (err) {
        lastError = err;
        if (attempt === maxRetries) break;
        const delay = initialDelayMs * Math.pow(2, attempt - 1);
        this.logger.warn(`Storage operation failed (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
    throw lastError;
  }

  /**
   * Operational storage monitoring check
   */
  async getStorageHealth(): Promise<{
    provider: string;
    configured: boolean;
    bucketName: string;
    status: 'healthy' | 'mock';
  }> {
    const isMock = this.storageProvider.constructor.name === 'MockStorageProvider';
    return {
      provider: isMock ? 'mock' : 'cloudflare-r2',
      configured: true,
      bucketName: process.env.R2_BUCKET_NAME || 'corviin-hub-assets',
      status: isMock ? 'mock' : 'healthy',
    };
  }
}

