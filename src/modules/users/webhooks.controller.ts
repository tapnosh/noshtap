import { Controller, Post, Req, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Public } from '../../decorators/public.decorator';
import { verifyWebhook } from '@clerk/backend/webhooks';
import { USER_EVENTS, UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent } from './users.type';

@Controller('webhooks')
@Public()
export class WebhooksController {
    constructor(
        @Inject(EventEmitter2)
        private readonly eventEmitter: EventEmitter2
    ) { }

    private readonly EVENT_HANDLERS = {
        'user.created': this.handleUserCreated.bind(this),
        'user.updated': this.handleUserUpdated.bind(this),
        'user.deleted': this.handleUserDeleted.bind(this),
    }

    @Post('')
    async handleClerkUserWebhook(@Req() req: Request) {
        try {
            const evt = await verifyWebhook(req);

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
} 
