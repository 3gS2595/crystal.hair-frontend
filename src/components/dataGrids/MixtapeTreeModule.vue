<template>
  <AddMixtapeBox v-if="store.addMixtapeBoxView" />
  <AddFolderBox v-if="store.addFolderBoxView" />
  <EditMixtapeBox v-if="store.editMixtapeBoxView" />

  <div class="pane-nav-body">
    <div class="pane-nav-header">
      <input
        id="global-search-input"
        class="input-standard text-main-0"
        v-model="q"
        placeholder="search"
        @keyup.enter="search(q)"
      />
    </div>
  </div>
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
          <div @click="open_mix(node.id)" class="dgb-nav">
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
            <div>
              <a class="descr descr-r font-s-descr text-main-0">
                {{ convertDate(node.content_id) }}
              </a>
              <a class="descr descr-l font-s-descr text text-main-0">
                {{ convertCount(blockCnt(node.content_id)) }}
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

  import AddMixtapeBox from '@/components/uploaders/AddMixtape.vue'
  import EditMixtapeBox from '@/components/dataEditors/EditBox.vue'
  import AddFolderBox from '@/components/uploaders/AddFolder.vue'

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
    return userFeedStore.user_feed.feed_mixtape.includes(mixtapeId)
  }

  // Function to get the number of blocks in a mixtape
  const blockCnt = (contentId: string): number | null => {
    const content = connectionsStore.connections_mix.find(i => i.id === contentId)
    return content ? content.contains.length : null
  }

  // Convert count to a string in the format {count} or ' ' if null
  const convertCount = (count: number | null): string => {
    return count != null ? `{${count}}` : ' '
  }

  // Convert date to a string in the format {DD: HH: MM}
  const convertDate = (contentId: string): string => {
    const connection = connectionsStore.connections_mix.find(i => i.id === contentId)
    if (connection?.updated_at) {
      const datetime = new Date(connection.updated_at)
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
    return ''
  }

  // Function to search for a mixtape by its ID
  function open_mix(id: string) {
    store.mixtape = store.mixtape === id ? '' : id
  }
  const q = ref('')
  function search(e: string) {
    store.filter = e
    q.value = ''
  }
</script>
