<script setup lang="ts">
import { provide, shallowRef, watch, onUnmounted } from 'vue';
import type { InjectionKey, ShallowRef } from 'vue';
import { SpaceClient as SpaceClientClass } from "../clients/SpaceClient";
import { TokenService } from "../services/token";
import type { SpaceConfiguration, SpaceClientContext } from "../types";

export const SpaceContextKey: InjectionKey<ShallowRef<SpaceClientContext | undefined>> = Symbol('SpaceContext');

const props = defineProps<{
  config: SpaceConfiguration
}>();

const contextValue = shallowRef<SpaceClientContext | undefined>();
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
</script>

<template>
  <div class="space-provider-wrapper">
    <slot />
  </div>
</template>