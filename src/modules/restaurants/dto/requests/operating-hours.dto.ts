import { IsString, Matches, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DayOperatingHoursDto {
    @IsString()
    @Matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Time must be in HH:MM format',
    })
    openFrom: string;

    @IsString()
    @Matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Time must be in HH:MM format',
    })
    openUntil: string;
}

export class OperatingHoursDto {
    @ValidateNested()
    @Type(() => DayOperatingHoursDto)
    monday: DayOperatingHoursDto;

    @ValidateNested()
    @Type(() => DayOperatingHoursDto)
    tuesday: DayOperatingHoursDto;

    @ValidateNested()
    @Type(() => DayOperatingHoursDto)
    wednesday: DayOperatingHoursDto;

    @ValidateNested()
    @Type(() => DayOperatingHoursDto)
    thursday: DayOperatingHoursDto;

    @ValidateNested()
    @Type(() => DayOperatingHoursDto)
    friday: DayOperatingHoursDto;

    @ValidateNested()
    @Type(() => DayOperatingHoursDto)
    saturday: DayOperatingHoursDto;

    @ValidateNested()
    @Type(() => DayOperatingHoursDto)
    sunday: DayOperatingHoursDto;
}
