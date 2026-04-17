import type { InjectionKey, ShallowRef } from 'vue';
import type { SpaceClientContext } from "@/types";

export const SpaceContextKey: InjectionKey<ShallowRef<SpaceClientContext | undefined>> = Symbol('SpaceContext');