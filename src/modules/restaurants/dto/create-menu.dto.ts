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
    * The menu schema (structure of sections and items)
    * @example { "sections": [ { "title": "Main Courses", "items": [ { "name": "Pizza", "price": 12 } ] } ] }
    */
    @IsObject()
    schema: Record<string, any>;
}