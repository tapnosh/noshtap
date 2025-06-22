import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { QrCode } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class QrService {
    constructor(private readonly configService: ConfigService, private readonly prisma: PrismaService) { }

    async generateCode(restaurantId: string, code: string): Promise<string> {
        const url = this.getEndpointUrl(code);
        const redirectUrl = this.getRedirectUrl(code);

        await this.prisma.qrCode.upsert({
            where: {
                code,
                is_deleted: false,
            },
            create: {
                restaurant_id: restaurantId,
                code: code,
                redirect_url: redirectUrl,
            },
            update: {}
        });

        return url;
    }

    async findOne(code: string): Promise<QrCode | null> {
        return this.prisma.qrCode.findUnique({
            where: {
                code,
                is_deleted: false,
            },
        });
    }

    private getEndpointUrl(code: string) {
        const baseUrl = this.configService.get('BASE_URL');

        return `${baseUrl}/public_api/codes/${code}`;
    }

    private getRedirectUrl(code: string) {
        const frontendUrl = this.configService.get('FRONTEND_URL');
        return `${frontendUrl}/restaurants/${code}/menu`;
    }
}