import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => applyDecorators(
  SetMetadata(IS_PUBLIC_KEY, true),
  ApiSecurity({}),
  ApiTags('Public')
);
