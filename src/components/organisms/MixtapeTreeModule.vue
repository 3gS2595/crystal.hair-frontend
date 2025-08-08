<template>
  <BaseDraggableTree
    :treeData="treeData"
    :feedCheck="feedCheck"
    :getBlockCount="getBlockCount"
    :getDateValue="getDateValue"
    :showDetails="showDetails"
    :onNodeClick="onNodeClick"
  />
</template>

<script setup lang="ts">
import BaseDraggableTree from '@/components/atoms/NavTreeModule.vue'
import { useConnectionsStore } from '@/stores/api/connectionsStore'
import { useUserFeedStore } from '@/stores/api/UserFeedStore'
import { GlobalStore } from '@/stores/GlobalStore'

const props = defineProps<{ treeData: any }>()
const connectionsStore = useConnectionsStore()
const userFeedStore = useUserFeedStore()
const store = GlobalStore()

const feedCheck = (id: string) => userFeedStore.user_feed.feed_mixtape.includes(id)
const getBlockCount = (node: any) => {
  const content = connectionsStore.connections_mix.find((i: any) => i.id === node.content_id)
  return content ? content.contains.length : null
}
const getDateValue = (node: any) => {
  const connection = connectionsStore.connections_mix.find((i: any) => i.id === node.content_id)
  return connection?.updated_at || null
}
const showDetails = (stat: any, node: any) => true // always show details in mixtape

function onNodeClick(node: any) {
  store.mixtape = store.mixtape === node.id ? '' : node.id
}
</script>

