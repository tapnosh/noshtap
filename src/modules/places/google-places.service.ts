import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GooglePlaceResult = {
  formatted_address?: string;
  address_components?: GoogleAddressComponent[];
  geometry?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
};

type SessionTokenCache = {
  token: string;
  expiresAt: number;
};

@Injectable()
export class GooglePlacesService {
  private readonly apiKey: string;
  private readonly sessionTokenCache = new Map<string, SessionTokenCache>();
  // Google doesn't officially specify expiration, but developers report ~3 minutes
  // Session should conclude after Place Details is called (which we do)
  private readonly SESSION_TOKEN_TTL_MS = 3 * 60 * 1000; // 3 minutes

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GOOGLE_PLACES_API_KEY') ?? '';

    if (!this.apiKey) {
      // Fail fast on startup if the key is not configured.
      throw new Error(
        'Google Places API key is not configured. Set GOOGLE_PLACES_API_KEY.',
      );
    }

    // Clean up expired tokens every 2 minutes
    setInterval(() => this.cleanupExpiredTokens(), 2 * 60 * 1000);
  }

  private generateSessionToken(): string {
    return randomUUID();
  }

  private getOrCreateSessionToken(sessionToken?: string): string {
    if (sessionToken) {
      const cached = this.sessionTokenCache.get(sessionToken);
      if (cached && cached.expiresAt > Date.now()) {
        return sessionToken;
      }
      // Token expired or doesn't exist, remove it
      this.sessionTokenCache.delete(sessionToken);
    }

    // Generate new token
    const newToken = this.generateSessionToken();
    this.sessionTokenCache.set(newToken, {
      token: newToken,
      expiresAt: Date.now() + this.SESSION_TOKEN_TTL_MS,
    });

    return newToken;
  }

  private cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [token, cache] of this.sessionTokenCache.entries()) {
      if (cache.expiresAt <= now) {
        this.sessionTokenCache.delete(token);
      }
    }
  }

  async autocomplete(input: string, sessionToken?: string) {
    const token = this.getOrCreateSessionToken(sessionToken);

    const params = new URLSearchParams({
      input,
      types: 'address',
      key: this.apiKey,
      sessiontoken: token,
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`,
    );

    if (!response.ok) {
      throw new InternalServerErrorException(
        'Failed to call Google Places Autocomplete API',
      );
    }

    const data: any = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new InternalServerErrorException(
        `Google Places Autocomplete error: ${data.status}`,
      );
    }

    return {
      status: data.status,
      sessionToken: token,
      predictions: (data.predictions ?? []).map((prediction: any) => ({
        description: prediction.description,
        placeId: prediction.place_id,
      })),
    };
  }

  async getPlaceDetails(placeId: string, sessionToken?: string) {
    if (!sessionToken) {
      throw new InternalServerErrorException(
        'Session token is required for place details. Use the sessionToken returned from autocomplete.',
      );
    }

    const cached = this.sessionTokenCache.get(sessionToken);
    if (!cached || cached.expiresAt <= Date.now()) {
      throw new InternalServerErrorException(
        'Invalid or expired session token. Please start a new autocomplete session.',
      );
    }

    const params = new URLSearchParams({
      place_id: placeId,
      key: this.apiKey,
      fields: 'formatted_address,address_component,geometry',
      sessiontoken: sessionToken,
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`,
    );

    if (!response.ok) {
      throw new InternalServerErrorException(
        'Failed to call Google Place Details API',
      );
    }

    const data: any = await response.json();

    if (data.status !== 'OK') {
      throw new InternalServerErrorException(
        `Google Place Details error: ${data.status}`,
      );
    }

    // Invalidate the session token after place details is called
    // (Google recommends using a session token only once for billing optimization)
    this.sessionTokenCache.delete(sessionToken);

    const result: GooglePlaceResult = data.result ?? {};
    const components = result.address_components ?? [];

    const getComponent = (type: string): GoogleAddressComponent | undefined =>
      components.find((component) => component.types.includes(type));

    const route = getComponent('route');
    const streetNumber = getComponent('street_number');
    const locality = getComponent('locality');
    const sublocality = getComponent('sublocality');
    const adminAreaLevel1 = getComponent('administrative_area_level_1');
    const adminAreaLevel2 = getComponent('administrative_area_level_2');
    const country = getComponent('country');
    const postalCode = getComponent('postal_code');

    const city =
      locality?.long_name ??
      sublocality?.long_name ??
      adminAreaLevel2?.long_name ??
      '';

    const geometry = result.geometry?.location;

    return {
      formattedAddress: result.formatted_address ?? '',
      street: route?.long_name ?? '',
      streetNumber: streetNumber?.long_name ?? '',
      city,
      state: adminAreaLevel1?.long_name ?? '',
      stateCode: adminAreaLevel1?.short_name ?? '',
      country: country?.long_name ?? '',
      countryCode: country?.short_name ?? '',
      postalCode: postalCode?.long_name ?? '',
      lat: geometry?.lat ?? null,
      lng: geometry?.lng ?? null,
    };
  }
}


