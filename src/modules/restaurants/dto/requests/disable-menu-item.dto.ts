import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class DisableMenuItemDto {
    /**
     * The ID of the menu item to disable
     * @example "item-1766927351457"
     */
    @IsString()
    menuItemId: string;

    /**
     * The ID of the restaurant
     * @example "fc4287e8-90f3-4297-9c74-f9c5e79e261f"
     */
    @IsUUID()
    restaurantId: string;

    /**
     * Date and time from which the item is disabled
     * @example "2026-01-12T18:12:32.786Z"
     */
    @IsOptional()
    @IsDateString()
    disabledFrom?: string | null;

    /**
     * Date and time until which the item is disabled
     * @example "2026-01-12T19:12:32.786Z"
     */
    @IsOptional()
    @IsDateString()
    disabledUntil?: string | null;
}
