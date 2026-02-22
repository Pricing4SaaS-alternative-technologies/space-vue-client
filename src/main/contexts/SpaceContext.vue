<script lang="ts">
import { defineComponent, provide, shallowRef, watch } from 'vue';
import type { ShallowRef } from 'vue';
import { SpaceClient as SpaceClientClass } from "../clients/SpaceClient";
import { TokenService } from "../services/token";
import type { SpaceConfiguration, SpaceClientContext } from "../types";

export const SpaceContextKey: symbol = Symbol('SpaceContext');

export default defineComponent({
  name: 'SpaceProvider',

  props: {
    config: {
      type: Object as () => SpaceConfiguration,
      required: true
    }
  },

  setup(props) {
    const contextValue: ShallowRef<SpaceClientContext | undefined> = shallowRef();
    let currentClient: SpaceClientClass | undefined;

    watch(
      () => [props.config.url, props.config.apiKey, props.config.allowConnectionWithSpace],
      () => {
        const denyConnection = props.config.allowConnectionWithSpace === false;
        const client = denyConnection ? undefined : new SpaceClientClass(props.config);

        let tokenService: TokenService;
        if (!client) {
          tokenService = new TokenService();
        } else {
          tokenService = client.token;
        }

        currentClient = client;
        contextValue.value = { client, tokenService };
      },
      { immediate: true }
    );

    provide(SpaceContextKey, contextValue);

    return {}; // no necesitamos exponer nada al template
  }
});
</script>

<template>
  <div class="space-provider-wrapper">
    <slot />
  </div>
</template>