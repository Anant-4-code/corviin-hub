import { Injectable, Logger } from '@nestjs/common';
import {
  ObjectStorageProvider,
  PresignedUploadResult,
  PresignedDownloadResult,
  ObjectMetadata,
} from './object-storage.interface';

@Injectable()
export class MockStorageProvider implements ObjectStorageProvider {
  private readonly logger = new Logger(MockStorageProvider.name);
  private readonly objects: Map<string, { size: number; contentType: string; date: Date }> =
    new Map();

  constructor() {
    this.logger.log('Initialized MockStorageProvider for local / offline development.');
  }

  async createUploadUrl(
    storageKey: string,
    contentType: string,
    expiresInSeconds = 900,
  ): Promise<PresignedUploadResult> {
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();
    const mockToken = Buffer.from(`${storageKey}:${Date.now()}`).toString('base64');
    const uploadUrl = `https://mock-r2.corviin.internal/upload/${storageKey}?token=${mockToken}`;

    // Pre-register mock object for simulation
    this.objects.set(storageKey, {
      size: 1024,
      contentType,
      date: new Date(),
    });

    return {
      uploadUrl,
      storageKey,
      expiresAt,
      headers: {
        'Content-Type': contentType,
      },
    };
  }

  async createDownloadUrl(
    storageKey: string,
    expiresInSeconds = 3600,
  ): Promise<PresignedDownloadResult> {
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();
    const downloadUrl = `https://mock-r2.corviin.internal/download/${storageKey}?exp=${expiresInSeconds}`;

    return {
      downloadUrl,
      expiresAt,
    };
  }

  async deleteObject(storageKey: string): Promise<void> {
    this.objects.delete(storageKey);
    this.logger.log(`Mock object deleted: ${storageKey}`);
  }

  async objectExists(storageKey: string): Promise<boolean> {
    return this.objects.has(storageKey);
  }

  async getObjectMetadata(storageKey: string): Promise<ObjectMetadata | null> {
    const obj = this.objects.get(storageKey);
    if (!obj) {
      return null;
    }
    return {
      sizeBytes: obj.size,
      contentType: obj.contentType,
      etag: 'mock-etag-12345',
      lastModified: obj.date,
    };
  }
}

