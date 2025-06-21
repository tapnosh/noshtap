import { IsString, IsUUID, IsObject, MaxLength, IsJSON, Max } from "class-validator";

export class CreateMenuDto {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsUUID()
    restaurant_id: string;

    /**
    * We use @IsObject() instead of @IsJSON() because the incoming schema
    * is a parsed JSON object — not a raw JSON string.
    */
    @IsObject()
    schema: Record<string, any>;
}