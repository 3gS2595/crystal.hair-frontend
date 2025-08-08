<template>
  <NavTreeModule
    :treeData="treeData"
    :feedCheck="feedCheck"
    :getBlockCount="getBlockCount"
    :getDateValue="getDateValue"
    :showDetails="showDetails"
    :onNodeClick="onNodeClick"
  />
</template>

<script setup lang="ts">
  import NavTreeModule from '@/components/atoms/NavTreeModule.vue'
  import { useConnectionsStore } from '@/stores/api/connectionsStore'
  import { useUserFeedStore } from '@/stores/api/UserFeedStore'
  import { GlobalStore } from '@/stores/GlobalStore'

  const props = defineProps<{ treeData: any; type: 'mixtape' | 'scraper' }>()

  const connectionsStore = useConnectionsStore()
  const userFeedStore = useUserFeedStore()
  const store = GlobalStore()

  // Depending on type, choose appropriate logic:

  const feedCheck = (id: string) => {
    if (props.type === 'mixtape') {
      return userFeedStore.user_feed.feed_mixtape.includes(id)
    } else {
      return userFeedStore.user_feed.feed_sources.includes(id)
    }
  }

  const getBlockCount = (node: any) => {
    if (props.type === 'mixtape') {
      const content = connectionsStore.connections_mix.find((i: any) => i.id === node.content_id)
      return content ? content.contains.length : null
    } else {
      const content = connectionsStore.connections_src.find((i: any) => i.id === node.contents)
      return content ? parseInt(content.contains, 10) : null
    }
  }

  const getDateValue = (node: any) => {
    if (props.type === 'mixtape') {
      const connection = connectionsStore.connections_mix.find((i: any) => i.id === node.content_id)
      return connection?.updated_at || null
    } else {
      return node.time_last_entry || null
    }
  }

  const showDetails = (stat: any) => {
    return props.type === 'mixtape' ? true : !stat.children.length
  }

  function onNodeClick(node: any) {
    if (props.type === 'mixtape') {
      store.mixtape = store.mixtape === node.id ? '' : node.id
    } else {
      store.srcUrlSubset = store.srcUrlSubset === node.id ? '-1' : node.id
    }
  }
</script>

