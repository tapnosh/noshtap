import { IsString, IsObject, MaxLength, IsOptional } from "class-validator";

export class UpdateMenuDto {
    /**
    * The updated name of the menu
    * @example "Dinner Menu"
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
    @IsOptional()
    schema?: Record<string, any>;
}