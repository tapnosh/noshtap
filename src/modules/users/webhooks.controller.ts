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
        try {
            console.log('Webhook received:', body);

            const evt = this.verifyWebhook(body, svixId, svixTimestamp, svixSignature) as WebhookEvent;

            console.log('Webhook verified:', evt);

            const handler = this.EVENT_HANDLERS[evt.type];
            if (!handler) {
                console.log(`Unhandled webhook type: ${evt.type}`);
                return { status: 'ignored' };
            }

            await handler(evt.data);
            return { status: 'processed' };
        } catch (error) {
            console.error('Webhook verification failed:', error);
            return { error: 'Webhook verification failed' };
        }
    }

    private async handleUserCreated(userData: UserCreatedEvent) {
        console.log('User created:', userData.id);

        // Emit event for other modules to react to
        this.eventEmitter.emit(USER_EVENTS.USER_CREATED, userData);

        return { status: 'processed' };
    }

    private async handleUserUpdated(userData: UserUpdatedEvent) {
        console.log('User updated:', userData.id);

        // Emit event for other modules to react to
        this.eventEmitter.emit(USER_EVENTS.USER_UPDATED, userData);

        return { status: 'processed' };
    }

    private async handleUserDeleted(userData: UserDeletedEvent) {
        console.log('User deleted:', userData.id);

        // Emit event for other modules to react to
        this.eventEmitter.emit(USER_EVENTS.USER_DELETED, userData);

        return { status: 'processed' };
    }

    private verifyWebhook(body: any, svixId: string, svixTimestamp: string, svixSignature: string): unknown {
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

        // Convert body to JSON string for verification
        const payload = typeof body === 'string' ? body : JSON.stringify(body);

        return wh.verify(payload, headers);
    }
} 
