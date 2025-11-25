import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsObject, MaxLength, IsOptional } from "class-validator";

export class UpdateMenuDto {
    /**
    * The updated name of the menu
    * @example "Dinner Menu"
    */
    @IsString()
    @IsOptional()
    @MaxLength(255)
    @ApiProperty({
        description: 'The updated name of the menu',
        example: 'Dinner Menu',
    })
    name?: string;

    /**
    * The menu schema (structure of sections and items)
    * @example { "header": [ { "version": "v1", "type": "heading", "heading": "Welcome to Our Restaurant" } ], "menu": [] }
    */
    @IsObject()
    @IsOptional()
    @ApiProperty({
        description: 'The updated menu schema (structure of sections and items)',
        example: { "header": [{ "version": "v1", "type": "heading", "heading": "Welcome to Our Restaurant" }], "menu": [] },
    })
    schema?: Record<string, any>;
}