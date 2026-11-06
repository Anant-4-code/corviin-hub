import { Module, Global, Logger } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { OBJECT_STORAGE_PROVIDER } from './object-storage.interface';
import { R2StorageProvider } from './r2-storage.provider';
import { MockStorageProvider } from './mock-storage.provider';

@Global()
@Module({
  controllers: [StorageController],
  providers: [
    {
      provide: OBJECT_STORAGE_PROVIDER,
      useFactory: () => {
        const logger = new Logger('StorageModule');
        const accessKey = process.env.R2_ACCESS_KEY_ID;
        const secretKey = process.env.R2_SECRET_ACCESS_KEY;
        const accountId = process.env.R2_ACCOUNT_ID;

        const isRealR2Configured =
          Boolean(accessKey) &&
          Boolean(secretKey) &&
          Boolean(accountId) &&
          !accessKey?.startsWith('mock-');

        if (isRealR2Configured) {
          logger.log('Connecting to Cloudflare R2 object storage provider.');
          return new R2StorageProvider();
        } else {
          logger.log('Cloudflare R2 credentials not provided or mock; initializing MockStorageProvider.');
          return new MockStorageProvider();
        }
      },
    },
    StorageService,
  ],
  exports: [StorageService, OBJECT_STORAGE_PROVIDER],
})
export class StorageModule {}

