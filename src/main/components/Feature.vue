<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useTokenService } from '@/hooks/useTokenService';
import { usePricingTokenPayload } from '@/hooks/usePricingTokenPayload';

// 1. Props
const props = defineProps<{
  id: string;
}>();

// 2. Servicios y Hooks
const tokenService = useTokenService();
// Obtenemos el payload reactivo. Aunque no leamos su valor aquí,
// necesitamos observarlo para re-evaluar si cambia el token.
const tokenPayload = usePricingTokenPayload(); 

// 3. Estado interno
type Status = 'loading' | 'success' | 'error';
const status = ref<Status>('loading');
const result = ref<boolean | null>(null);

// 4. Validación del ID (equivalente a useMemo)
const isValidId = computed(() => props.id.includes('-'));

// 5. Función principal de evaluación
const evaluate = () => {
  // Validación básica
  if (!isValidId.value) {
    status.value = 'error';
    return;
  }
  
  // Si no hay payload cargado en el servicio, es un error o falta de init
  if (tokenService.getPayload() === null) {
    status.value = 'error';
    return;
  }

  // Empezamos a evaluar
  status.value = 'loading';
  result.value = null;

  try {
    const evaluationResult = tokenService.evaluateFeature(props.id);
    
    if (evaluationResult === null || evaluationResult === undefined) {
      status.value = 'error';
    } else {
      result.value = evaluationResult;
      status.value = 'success';
    }
  } catch (error) {
    console.error(error);
    status.value = 'error';
  }
};

// 6. Ciclo de vida y suscripciones
let unsubscribe: (() => void) | null = null;

onMounted(() => {
  // Primera evaluación
  evaluate();

  // Suscribirse a cambios en el servicio de tokens (para actualizaciones en tiempo real)
  unsubscribe = tokenService.subscribe(() => {
    evaluate();
  });
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

// 7. Watchers (Reaccionan a cambios)
// Si cambia el ID de la prop, re-evaluamos
watch(() => props.id, evaluate);

// Si cambia el payload (ej. el usuario cambia de plan o se refresca el token), re-evaluamos
watch(tokenPayload, evaluate);
</script>

<template>
  <template v-if="status === 'loading'">
    <slot name="loading" />
  </template>

  <template v-else-if="status === 'error'">
    <slot name="errorFallback" />
  </template>

  <template v-else-if="status === 'success' && result === true">
    <slot name="on" />
    <slot />
  </template>

  <template v-else-if="status === 'success' && result === false">
    <slot name="default" />
  </template>

</template>