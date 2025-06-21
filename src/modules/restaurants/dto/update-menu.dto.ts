import { IsString, IsObject, MaxLength } from "class-validator";

export class UpdateMenuDto {
    /**
    * The updated name of the menu
    * @example "Dinner Menu"
    */
    @IsString()
    @MaxLength(255)
    name?: string;

    /**
    * The updated menu schema
    * @example { "sections": [ { "title": "Desserts", "items": [ { "name": "Ice Cream", "price": 5 } ] } ] }
    */
    @IsObject()
    schema?: Record<string, any>;
}