import { IsString, IsUUID, IsObject, MaxLength, IsJSON, IsOptional } from "class-validator";

export class CreateMenuDto {
    /**
    * The name of the menu
    * @example "Lunch Menu"
    */
    @IsString()
    @IsOptional()
    @MaxLength(255)
    name?: string;

    /**
    * The menu schema (structure of sections and items)
    * @example { "header": [ { "version": "v1", "type": "heading", "heading": "Welcome to Our Restaurant" } ], "menu": [] }
    */
    @IsObject()
    schema: Record<string, any>;
}