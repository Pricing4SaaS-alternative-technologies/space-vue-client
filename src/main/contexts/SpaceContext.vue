<script lang="ts">
import type { InjectionKey, ShallowRef } from 'vue';
import type { SpaceClientContext } from "@/types";

// Esta es la "Key" que usará tu hook useSpaceClient para encontrar los datos.
// Equivale a: export const SpaceContext = createContext(...)
export const SpaceContextKey: InjectionKey<ShallowRef<SpaceClientContext | undefined>> = Symbol('SpaceContext');
</script>

<script setup lang="ts">
import { provide, shallowRef, watch, onUnmounted } from 'vue';
import { SpaceClient as SpaceClientClass } from "../clients/SpaceClient";
import { TokenService } from "@/services/token";
import type { SpaceConfiguration } from "@/types";

// Recibimos la config como Prop
const props = defineProps<{
  config: SpaceConfiguration
}>();

// Estado reactivo (shallowRef es mejor para instancias de clases)
const contextValue = shallowRef<SpaceClientContext | undefined>();
let currentClient: SpaceClientClass | undefined;

// Unificamos la lógica de useMemo y useEffect en un solo observador (watch)
watch(
  // Observamos las propiedades individuales igual que en el array de dependencias de React
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
  { immediate: true } // Se ejecuta al montar (igual que el primer render de React)
);

// Proveemos el contexto a los hijos
provide(SpaceContextKey, contextValue);
</script>

<template>
  <slot />
</template>