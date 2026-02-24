<script lang="ts">
import { defineComponent, provide, shallowRef, watch } from 'vue';
import type { ShallowRef } from 'vue';
import { SpaceClient as SpaceClientClass } from "../clients/SpaceClient";
import { TokenService } from "../services/token";
import type { SpaceConfiguration, SpaceClientContext } from "../types";

import { SpaceContextKey } from '../contexts/SpaceContextTypes';
import { tokenService as globalTokenService } from "../services/token";

export default defineComponent({
  name: 'SpaceProvider',

  props: {
    config: {
      type: Object as () => SpaceConfiguration,
      required: true
    }
  },

  setup(props) {

    // 🔹 1. Crear cliente inicial inmediatamente (NUNCA undefined)
    const createContext = (): SpaceClientContext => {
      const denyConnection = props.config.allowConnectionWithSpace === false;

      const client = denyConnection
        ? undefined
        : new SpaceClientClass(props.config);

      const tokenService = client
        ? client.token
        : globalTokenService;

      return { client, tokenService };
    };

    // 🔹 2. Inicializar contexto con valor válido
    const contextValue: ShallowRef<SpaceClientContext> =
      shallowRef(createContext());

    // 🔹 3. Proveer inmediatamente (sin estado intermedio undefined)
    provide(SpaceContextKey, contextValue);

    // 🔹 4. Reactividad cuando cambie config
    watch(
      () => [
        props.config.url,
        props.config.apiKey,
        props.config.allowConnectionWithSpace
      ],
      () => {
        contextValue.value = createContext();
      }
    );

    return {};
  }
});
</script>

<template>
  <div class="space-provider-wrapper">
    <slot />
  </div>
</template>