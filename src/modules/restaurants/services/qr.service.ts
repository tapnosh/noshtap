import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { QrCode } from "@prisma/client";
import * as QRCode from 'qrcode';
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class QrService {
    constructor(private readonly configService: ConfigService, private readonly prisma: PrismaService) { }

    async generateCode(restaurantId: string, code: string): Promise<string> {
        const baseUrl = this.configService.get('BASE_URL');
        const endpointPath = this.getEndpointPath(code);

        const url = `${baseUrl}${endpointPath}`;

        const qrCode = await QRCode.toDataURL(url);

        await this.prisma.qrCode.upsert({
            where: {
                code,
                is_deleted: false,
            },
            create: {
                restaurant_id: restaurantId,
                code: code,
                redirect_url: url,
            },
            update: {}
        });

        return qrCode;
    }

    async findOne(code: string): Promise<QrCode | null> {
        return this.prisma.qrCode.findUnique({
            where: {
                code,
                is_deleted: false,
            },
        });
    }

    private getEndpointPath(path: string) {
        return `/public_api/codes/${path}`;
    }
}