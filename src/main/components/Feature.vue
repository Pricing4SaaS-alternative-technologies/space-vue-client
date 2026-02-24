<script lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, defineComponent } from 'vue';

import { useTokenService } from '../hooks/useTokenService';
import { usePricingTokenPayload } from '../hooks/usePricingTokenPayload';

export default defineComponent({
  name: 'Feature',

  props: {
    id: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const tokenService = useTokenService();
    const tokenPayload = usePricingTokenPayload();

    type Status = 'loading' | 'success' | 'error';

    const status = ref<Status>('loading');
    const result = ref<boolean | null>(null);

    const isValidId = computed(() => props.id.includes('-'));

    const evaluate = () => {
      if (!isValidId.value) {
        status.value = 'error';
        return;
      }

      if (tokenService.getPayload() === null) {
        status.value = 'error';
        return;
      }

      status.value = 'loading';
      result.value = null;

      try {
        const evaluationResult = tokenService.evaluateFeature(props.id);

        if (evaluationResult == null) {
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

    let unsubscribe: (() => void) | null = null;

    onMounted(() => {
      evaluate();
      unsubscribe = tokenService.subscribe(evaluate);
    });

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    });

    watch(() => props.id, evaluate);
    watch(tokenPayload, evaluate);

    return {
      status,
      result
    };
  }
});
</script>

<template>
  <div class="feature-wrapper">

    <template v-if="status === 'loading'">
      <slot name="loading" />
    </template>

    <template v-else-if="status === 'error'">
      <slot name="errorFallback" />
    </template>

    <template v-else-if="status === 'success' && result === true">
      <slot name="on" />
      <slot /> </template>

    <template v-else-if="status === 'success' && result === false">
      <slot name="fallback" />
    </template>

  </div>
</template>