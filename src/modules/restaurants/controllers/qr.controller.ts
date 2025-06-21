import { Controller, Get, NotFoundException, Param, Redirect, Res } from "@nestjs/common";
import { Public } from "src/decorators/public.decorator";
import { RestaurantsService } from "../services/restaurants.service";
import { ConfigService } from "@nestjs/config";
import { QrService } from "../services/qr.service";

@Controller('codes')
export class QrController {
    constructor(
        private readonly configService: ConfigService,
        private readonly qrService: QrService,
    ) { }

    @Get(':code')
    @Redirect()
    @Public()
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
