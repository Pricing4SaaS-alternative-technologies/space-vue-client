import { shallowRef, onMounted, onUnmounted, type Ref } from 'vue';
import { useTokenService } from './useTokenService';

/**
 * Vue composable que retorna el payload del token de precios.
 */
export function usePricingTokenPayload<T extends Record<string, any> = Record<string, any>>() {
  const tokenService = useTokenService();
  const payload = shallowRef<T | null>(tokenService.getPayload() as T | null);

  const updatePayload = () => {
    payload.value = tokenService.getPayload() as T | null;
  };

  let unsubscribe: (() => void) | null = null;

  onMounted(() => {
    // Asegurar la actualización al montar
    updatePayload(); 
    unsubscribe = tokenService.subscribe(updatePayload);
  });

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return payload;
}