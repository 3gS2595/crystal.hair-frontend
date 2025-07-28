<template>
  <transition name="dropdown-content">
    <div v-if="active" class="dropdown-content">
      <slot />
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue'

const sharedState = inject<{ active: boolean }>('sharedState')

const active = computed(() => sharedState?.active ?? false)
</script>

