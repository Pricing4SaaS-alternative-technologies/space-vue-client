export type { SpaceClient } from './clients/SpaceClient';
export type { TokenService } from './services/token';

export type SpaceEvents =
  | 'pricing_updated'
  | 'error';

export interface SpaceConfiguration {
  url: string;
  apiKey: string;
  allowConnectionWithSpace: boolean
}

export interface SpaceClientContext{
  client?: SpaceClient;
  tokenService: TokenService;
}

export * from './types/Events';