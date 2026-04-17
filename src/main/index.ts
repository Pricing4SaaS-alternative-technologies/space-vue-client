export { default as SpaceProvider } from './contexts/SpaceContext.vue';

export { useSpaceClient } from './hooks/useSpaceClient';
export { useTokenService } from './hooks/useTokenService';
export { usePricingTokenPayload } from './hooks/usePricingTokenPayload';

export { default as Feature } from './components/Feature.vue';

export * from './types';

import { tokenService } from './services/token';
export { tokenService };