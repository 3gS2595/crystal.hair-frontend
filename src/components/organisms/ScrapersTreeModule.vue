<template>
  <Search />
  <OverlayScrollbarsComponent defer>
    <Draggable ref="tree" id="tree" class="mtl-tree" v-model="treeData" :indent="15" treeLine>
      <template #default="{ node, stat }">
        <div :class="{ 'has-children': stat.children.length }" style="width: 100%">
          <OpenIcon
            v-if="stat.children.length"
            :open="stat.open"
            class="mtl-mr"
            @click="stat.open = !stat.open"
          />
          <div @click="open_src(node.id)" class="dgb-nav">
            <div class="dgb-title">
              <a class="title font-s-title text-main-0">
                {{ node.text }}
              </a>
              <img
                v-if="feedCheck(node.id)"
                class="mix-feed-icon"
                src="https://crystal-hair.nyc3.digitaloceanspaces.com/feed.png"
              />
            </div>
            <div v-if="!stat.children.length">
              <a class="descr descr-r font-s-descr text-main-0">
                {{ convertDate(node.time_last_entry) }}
              </a>
              <a class="descr descr-l font-s-descr text text-main-0">
                {{ blockCnt(node.contents) }}
              </a>
            </div>
          </div>
        </div>
      </template>
    </Draggable>
  </OverlayScrollbarsComponent>
</template>

<script setup lang="ts">
  import { toRefs, ref } from 'vue'
  import { Draggable, OpenIcon } from '@he-tree/vue'
  import '@he-tree/vue/style/default.css'
  import '@he-tree/vue/style/material-design.css'
  import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

  import type { contentType } from '@/types/ApiTypes'
  import Search from '@/components/atoms/Search.vue'


  import { useConnectionsStore } from '@/stores/api/connectionsStore'
  import { useUserFeedStore } from '@/stores/api/UserFeedStore'
  import { GlobalStore } from '@/stores/GlobalStore'
  const store = GlobalStore()
  const userFeedStore = useUserFeedStore()
  const connectionsStore = useConnectionsStore()

  const props = defineProps<{ treeData: any }>()
  const { treeData } = toRefs(props)

  // Function to check if a mixtape is in the user's feed
  const feedCheck = (mixtapeId: string): boolean => {
    return userFeedStore.user_feed.feed_sources.includes(mixtapeId)
  }

  // Function to get the number of blocks in a mixtape
  const blockCnt = (content_id: string): number | null => {
    const content = connectionsStore.connections_src.find((i: contentType) => i.id === content_id)
    console.log(content)
    return content ? parseInt(content.contains, 10) : null
  }

  // Convert date to a string in the format {DD: HH: MM}
  const convertDate = (contentId: string): string => {
    const datetime = new Date(contentId)
    const now = new Date()
    const days = Math.floor((now.getTime() - datetime.getTime()) / (1000 * 60 * 60 * 24))
    const hours = Math.floor((now.getTime() - datetime.getTime()) / (1000 * 60 * 60) - days * 24)
    const minutes = Math.floor(
      (now.getTime() - datetime.getTime()) / (1000 * 60) - hours * 60 - days * 24 * 60
    )
    return `{${days.toString().padStart(2, '0')}: ${hours.toString().padStart(2, '0')}: ${minutes
      .toString()
      .padStart(2, '0')}}`
  }

  // Methods
  function open_src(e: string): void {
    store.srcUrlSubset = store.srcUrlSubset === e ? '-1' : e
  }
</script>
