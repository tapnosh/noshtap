import { Controller, Post, Headers, Inject, Body } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Public } from '../../decorators/public.decorator';
import { USER_EVENTS, UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent } from './users.type';
import { ConfigService } from '@nestjs/config';
import { Webhook } from 'svix';

interface WebhookEvent {
    type: string;
    data: UserCreatedEvent | UserUpdatedEvent | UserDeletedEvent;
}

@Controller('webhooks')
@Public()
export class WebhooksController {
    constructor(
        @Inject(EventEmitter2)
        private readonly eventEmitter: EventEmitter2,
        private readonly configService: ConfigService
    ) { }

    private readonly EVENT_HANDLERS = {
        'user.created': this.handleUserCreated.bind(this),
        'user.updated': this.handleUserUpdated.bind(this),
        'user.deleted': this.handleUserDeleted.bind(this),
    }

    @Post('')
    async handleClerkUserWebhook(
        @Body() body: any,
        @Headers('svix-id') svixId: string,
        @Headers('svix-timestamp') svixTimestamp: string,
        @Headers('svix-signature') svixSignature: string
    ): Promise<{ status: string } | { error: string }> {
        const evt = this.verifyWebhook(
            body,
            svixId,
            svixTimestamp,
            svixSignature
        ) as WebhookEvent;

        const handler = this.EVENT_HANDLERS[evt.type];
        if (!handler) {
            throw new Error(`Unhandled webhook type: ${evt.type}`);
        }

        return handler(evt.data);
    }

    private handleUserCreated(userData: UserCreatedEvent) {
        this.eventEmitter.emit(USER_EVENTS.USER_CREATED, userData);

        return { status: 'processed' };
    }

    private handleUserUpdated(userData: UserUpdatedEvent) {
        this.eventEmitter.emit(USER_EVENTS.USER_UPDATED, userData);

        return { status: 'processed' };
    }

    private handleUserDeleted(userData: UserDeletedEvent) {
        this.eventEmitter.emit(USER_EVENTS.USER_DELETED, userData);

        return { status: 'processed' };
    }

    private verifyWebhook(
        body: any,
        svixId: string,
        svixTimestamp: string,
        svixSignature: string
    ): unknown {
        const secret = this.configService.get('CLERK_WEBHOOK_SIGNING_SECRET');

        if (!secret) {
            throw new Error('CLERK_WEBHOOK_SIGNING_SECRET is not set');
        }

        const wh = new Webhook(secret);

        const headers = {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
        };

        const payload = typeof body === 'string' ? body : JSON.stringify(body);

        return wh.verify(payload, headers);
    }
} 
