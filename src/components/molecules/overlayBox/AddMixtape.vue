<template>
  <CreateApiItem
    label="id:"
    placeholder="null"
    :onSubmit="(val) => mixtapeStore.addMixtape(val)"
    @close="$emit('close')"
  />
</template>

<script setup lang="ts">
  import CreateApiItem from '@/components/atoms/CreateApiItem.vue'
  import { useMixtapeStore } from '@/stores/api/MixtapeStore'

  const mixtapeStore = useMixtapeStore()
</script>
