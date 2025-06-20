import { ClerkClient } from '@clerk/backend';

export type UserListParams = Parameters<ClerkClient['users']['getUserList']>[0];

export type UpdateUserParams = Parameters<
  ClerkClient['users']['updateUser']
>[1];

export type CreateUserParams = Parameters<
  ClerkClient['users']['createUser']
>[0];

export interface UserCreatedEvent {
  id: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
  }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  created_at: number;
  updated_at: number;
}

export interface UserUpdatedEvent {
  id: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
  }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  created_at: number;
  updated_at: number;
}

export interface UserDeletedEvent {
  id: string;
  deleted: boolean;
}

export const USER_EVENTS = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
} as const;