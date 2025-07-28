<template>
  <AddMixtapeBox v-if='store.addFolderBoxView'/>
  <AddFolderBox v-if='store.addFolderBoxView'/>
  <EditMixtapeBox v-if="store.editMixtapeBoxView"/>

  <OverlayScrollbarsComponent style="z-index: 10;" defer>
    <AddMixtapeBox v-if="store.addMixtapeBoxView" />
@paste.prevent="pasteInFile($event)"
    <DataView class="dg-0" style="margin-top:6px; " :value="mixtapeStore.mixtapes" layout="list">
      <template #grid="slotProps">
        <div v-if="slotProps.data.id === 'page-0'" class="nav-loader">
          <img class="nav-loader-icon mix-loader" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/page-loader.gif" />
        </div>
        <div v-else @click="search(slotProps.data.id)" class="dgb-nav">
          <div class="dgb-title">
            <a class="title font-s-title text-main-0">
              {{ slotProps.data.name }}
            </a>
            <img
              v-if="feedCheck(slotProps.data.id)"
              class="mix-feed-icon"
              src="https://crystal-hair.nyc3.digitaloceanspaces.com/feed.png"
            />
          </div>
          <div>
            <a class="descr descr-r font-s-descr text-main-0" >
              {{ convertDate(slotProps.data.content_id) }}
            </a>
            <a class="descr descr-l font-s-descr text text-main-0">
              {{ convertCount(blockCnt(slotProps.data.content_id)) }}
            </a>
          </div>
        </div>
      </template>
    </DataView>
  </OverlayScrollbarsComponent>
</template>

<script setup lang="ts">
import { useMixtapeStore } from '@/stores/api/MixtapeStore'
import { useConnectionsStore } from '@/stores/api/connectionsStore'
import { useUserFeedStore } from '@/stores/api/UserFeedStore'
import { GlobalStore } from '@/stores/GlobalStore'
import AddMixtapeBox from '@/components/uploaders/AddMixtape.vue'
import AddFolderBox from '@/components/uploaders/AddFolder.vue'
import EditMixtapeBox from '@/components/dataEditors/EditBox.vue'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import DataView from 'primevue/dataview'

// Store references
const store = GlobalStore()
const mixtapeStore = useMixtapeStore()
const connectionsStore = useConnectionsStore()
const userFeedStore = useUserFeedStore()

const search = (id: string) => {
  store.mixtape = store.mixtape === id ? '' : id.toString()
}

const convertCount = (count: number | null): string => {
  return count != null ? `{${count}}` : ' '
}

const convertDate = (contentId: string): string => {
  const connection = connectionsStore.connections_mix.find(i => i.id === contentId)
  if (connection?.updated_at) {
    const datetime = new Date(connection.updated_at)
    const now = new Date()
    const days = Math.floor((now.getTime() - datetime.getTime()) / (1000 * 60 * 60 * 24))
    const hours = Math.floor((now.getTime() - datetime.getTime()) / (1000 * 60 * 60) - days * 24)
    const minutes = Math.floor((now.getTime() - datetime.getTime()) / (1000 * 60) - hours * 60 - days * 24 * 60)
    return `{${days.toString().padStart(2, '0')}: ${hours.toString().padStart(2, '0')}: ${minutes.toString().padStart(2, '0')}}`
  }
  return ''
}

const feedCheck = (mixtapeId: string): boolean => {
  return userFeedStore.user_feed.feed_mixtape.includes(mixtapeId)
}

const blockCnt = (contentId: string): number | null => {
  const content = connectionsStore.connections_mix.find(i => i.id === contentId)
  return content ? content.contains.length : null
}
</script>
