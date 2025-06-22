import { Controller, Get, NotFoundException, Param, Redirect } from "@nestjs/common";
import { Public } from "src/decorators/public.decorator";
import { ConfigService } from "@nestjs/config";
import { QrService } from "../../services/qr.service";

@Controller('public_api/codes')
@Public()
export class PublicQrController {
    constructor(
        private readonly qrService: QrService,
    ) { }

    @Get(':code')
    @Redirect()
    async redirect(@Param('code') code: string) {
        const qrCode = await this.qrService.findOne(code);

        if (!qrCode) {
            throw new NotFoundException('QR code not found');
        }

        return {
            url: qrCode.redirect_url,
            statusCode: 302
        };
    }

}
