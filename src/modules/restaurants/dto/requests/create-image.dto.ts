import { IsString, IsNotEmpty } from 'class-validator';

export class CreateImageDto {
    /**
     * The URL of the image
     * @example "https://example.com/image.jpg"
     */
    @IsString()
    @IsNotEmpty()
    url: string;

    /**
     * The URL of the image
     * @example "https://example.com/image.jpg"
     */
    @IsString()
    @IsNotEmpty()
    downloadUrl: string;

    /**
     * The pathname of the image
     * @example "image.jpg"
     */
    @IsString()
    @IsNotEmpty()
    pathname: string;

    /**
     * The content type of the image
     * @example "image/jpeg"
     */
    @IsString()
    @IsNotEmpty()
    contentType: string;

    /**
     * The content disposition of the image
     * @example "inline"
     */
    @IsString()
    @IsNotEmpty()
    contentDisposition: string;
}