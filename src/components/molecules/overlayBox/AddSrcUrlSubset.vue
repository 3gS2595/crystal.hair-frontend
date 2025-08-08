<template>
  <CreateApiItem
    label="url:"
    placeholder="null"
    :onSubmit="(val) => srcUrlSubsetStore.addSrcUrlSubset(val)"
    @close="$emit('close')"
  />
</template>

<script setup lang="ts">
import CreateApiItem from '@/components/atoms/CreateApiItem.vue'
import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'

const srcUrlSubsetStore = useSrcUrlSubsetStore()
</script>

