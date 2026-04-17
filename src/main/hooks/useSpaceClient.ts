import { inject } from 'vue';
import { SpaceContextKey } from '../contexts/SpaceContextTypes'; 
import type { SpaceClient } from '../clients/SpaceClient';

export function useSpaceClient(): SpaceClient {
  const spaceContextRef = inject(SpaceContextKey);

  if (!spaceContextRef) {
    throw new Error('useSpaceClient must be used within a SpaceProvider');
  }

  const context = spaceContextRef.value;

  if (!context || !context.client) {
    throw new Error(
      `SpaceClient is not initialized... (tu mensaje de error)`
    );
  }

  return context.client as SpaceClient;
}