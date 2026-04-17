import { inject } from 'vue';
import { SpaceContextKey } from '../contexts/SpaceContextTypes'; 

/**
 * Vue composable to access the service that manages the pricing token.
 * Throws an error if used outside of SpaceProvider.
 */
export function useTokenService() {
  const spaceContextRef = inject(SpaceContextKey);

  if (!spaceContextRef || !spaceContextRef.value) {
    throw new Error('useTokenService must be used within a SpaceProvider');
  }

  return spaceContextRef.value.tokenService;
}