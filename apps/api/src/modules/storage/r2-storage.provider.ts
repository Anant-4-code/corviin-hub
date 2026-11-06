import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  ObjectStorageProvider,
  PresignedUploadResult,
  PresignedDownloadResult,
  ObjectMetadata,
} from './object-storage.interface';

@Injectable()
export class R2StorageProvider implements ObjectStorageProvider {
  private readonly logger = new Logger(R2StorageProvider.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID || '';
    const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
    this.bucketName = process.env.R2_BUCKET_NAME || 'corviin-hub-assets';

    const endpoint =
      process.env.R2_ENDPOINT ||
      (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : '');

    this.logger.log(`Initializing Cloudflare R2 Client (Bucket: ${this.bucketName}, Endpoint: ${endpoint})`);

    this.s3Client = new S3Client({
      region: process.env.R2_REGION || 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async createUploadUrl(
    storageKey: string,
    contentType: string,
    expiresInSeconds = 900, // 15 mins default
  ): Promise<PresignedUploadResult> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: storageKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

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
    expiresInSeconds = 3600, // 1 hour default
  ): Promise<PresignedDownloadResult> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: storageKey,
    });

    const downloadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    return {
      downloadUrl,
      expiresAt,
    };
  }

  async deleteObject(storageKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: storageKey,
    });

    await this.s3Client.send(command);
    this.logger.log(`Deleted object from R2: ${storageKey}`);
  }

  async objectExists(storageKey: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: storageKey,
      });
      await this.s3Client.send(command);
      return true;
    } catch (err: any) {
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw err;
    }
  }

  async getObjectMetadata(storageKey: string): Promise<ObjectMetadata | null> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: storageKey,
      });
      const response = await this.s3Client.send(command);
      return {
        sizeBytes: response.ContentLength || 0,
        contentType: response.ContentType || 'application/octet-stream',
        etag: response.ETag?.replace(/"/g, ''),
        lastModified: response.LastModified,
      };
    } catch (err: any) {
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        return null;
      }
      throw err;
    }
  }
}

