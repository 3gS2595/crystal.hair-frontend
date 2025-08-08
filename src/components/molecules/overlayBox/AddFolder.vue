<template>
  <CreateApiItem
    label="folder:"
    placeholder="null"
    :onSubmit="(val) => folderStore.addFolder(val)"
    @close="$emit('close')"
  />
</template>

<script setup lang="ts">
  import CreateApiItem from '@/components/atoms/modules/CreateApiItem.vue'
  import { useFolderStore } from '@/stores/api/FolderStore'

  const folderStore = useFolderStore()
</script>
