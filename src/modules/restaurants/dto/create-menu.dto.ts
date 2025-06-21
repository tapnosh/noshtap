import { IsString, IsUUID, IsObject, MaxLength } from "class-validator";

export class CreateMenuDto {
    /**
    * The name of the menu
    * @example "Lunch Menu"
    */
    @IsString()
    @MaxLength(255)
    name: string;

    /**
    * The ID of the restaurant this menu belongs to
    * @example "4e7dc3b4-69d3-4e2c-9a87-f8761d5bcb32"
    */
    @IsUUID()
    restaurant_id: string;

    /**
    * The menu schema (structure of sections and items)
    * @example { "sections": [ { "title": "Main Courses", "items": [ { "name": "Pizza", "price": 12 } ] } ] }
    */
    @IsObject()
    schema: Record<string, any>;
    /**
    * We use @IsObject() instead of @IsJSON() because the incoming schema
    * is a parsed JSON object — not a raw JSON string.
    */
}