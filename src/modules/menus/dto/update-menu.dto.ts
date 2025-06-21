import { IsString, IsUUID, IsObject, MaxLength, IsJSON, Max } from "class-validator";

export class UpdateMenuDto {
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsObject()
    schema?: Record<string, any>;
}