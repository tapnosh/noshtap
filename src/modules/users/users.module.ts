import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersService } from './users.service';
import { ClerkClientProvider } from 'src/providers/clerk-client.provider';
import { WebhooksController } from './webhooks.controller';

@Module({
    imports: [ConfigModule],
    providers: [UsersService, ClerkClientProvider],
    controllers: [WebhooksController],
    exports: [UsersService],
})
export class UsersModule { }