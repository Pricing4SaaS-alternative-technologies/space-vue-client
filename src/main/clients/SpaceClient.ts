import { TinyEmitter } from 'tiny-emitter';
import type { SpaceEvents, SpaceConfiguration } from '@/types';
import axios, { AxiosInstance } from 'axios';
import { TokenService } from '@/services/token';


/**
 * SpaceClient handles API and WebSocket communication with SPACE.
 * It allows event subscription and provides feature evaluation methods.
 */
export class SpaceClient {
  private readonly httpUrl: string;
  private readonly apiKey: string;
  private readonly axios: AxiosInstance;
  private readonly emitter: any;
  public readonly token: TokenService;
  private userId: string | null = null;

  constructor(config: SpaceConfiguration) {
    this.httpUrl = config.url.endsWith('/')
      ? config.url.slice(0, -1) + '/api/v1'
      : config.url + '/api/v1';

    this.apiKey = config.apiKey;
    this.emitter = new TinyEmitter();
    this.token = new TokenService();

    this.axios = axios.create({
      baseURL: this.httpUrl,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${this.apiKey}`,
      },
    });
  }

  /**
   * Listen to SPACE and connection events.
   * @param event The event key to listen for.
   * @param callback The callback function to execute when the event is emitted.
   * @example
   * ```typescript
   * spaceClient.on('pricing_created', (data) => {
   *   console.log('Pricing created:', data);
   * });
   * ```
   * @throws Will throw an error if the event is not recognized.
   * @throws Will throw an error if the callback is not a function.
   */
  on(event: SpaceEvents, callback: (data: any) => void) {
    if (typeof callback !== 'function') {
      throw new Error(`Callback for event '${event}' must be a function.`);
    }
    // comprobamos que los eventos sean los correctos
    if (
      [
        'pricing_updated',
        'error',
      ].indexOf(event) === -1
    ) {
      throw new Error(`Event '${event}' is not recognized.`);
    }

    this.emitter.on(event, callback);
  }

  /**
   * Removes event listeners.
   * @param event (optional) The event to remove listeners for. If omitted, removes all listeners.
   * @param callback (optional) The specific callback to remove.
   */
  public off(event?: SpaceEvents, callback?: (data: any) => void) {
    if (event && callback) {
      this.emitter.off(event, callback);
    } else if (event) {
      this.emitter.off(event);
    } else {
      this.emitter.off();
    }
  }

  /**
   * Sets the user ID for the client and loads the pricing token for that user.
   * @param userId The user ID to set for the client.
   * @returns A promise that resolves when the user ID is set and the pricing token is generated.
   * @throws Will throw an error if the user ID is not a non-empty string.
   * @example
   * ```typescript
   * await spaceClient.setUserId('user123');
   * ```
   */
  async setUserId(userId: string): Promise<void> {
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('User ID must be a non-empty string.');
    }
    this.userId = userId;

    const userPricingToken = await this.generateUserPricingToken();

    this.token.update(userPricingToken);
    // importante generar el evento del pricing_updated
    this.emitter.emit('pricing_updated', userPricingToken)
  }

  /**
   * Performs a request to SPACE to retrieve a new pricing token for the user with the given userId.
   * @param userId The user ID for which to evaluate the feature.
   * @returns A promise that resolves to the pricing token.
   * @throws Will throw an error if the request fails.
   */
  async generateUserPricingToken(): Promise<string> {
    if (!this.userId) {
      throw new Error(
        'User ID is not set. Please set the user ID with `setUserId(userId)` before trying to generate a pricing token.',
      );
    }
    try {
      const response = await this.axios.post(`/features/${this.userId}/pricing-token`)
      return response.data.pricingToken
    } catch (error) {
      this.emitter.emit('error', error)
      throw error
    }
  }
}