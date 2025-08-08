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

const feedCheck = (id: string) => userFeedStore.user_feed.feed_sources.includes(id)
const getBlockCount = (node: any) => {
  const content = connectionsStore.connections_src.find((i: any) => i.id === node.contents)
  return content ? parseInt(content.contains, 10) : null
}
const getDateValue = (node: any) => node.time_last_entry || null
const showDetails = (stat: any, node: any) => !stat.children.length // show details only if no children

function onNodeClick(node: any) {
  store.srcUrlSubset = store.srcUrlSubset === node.id ? '-1' : node.id
}
</script>


