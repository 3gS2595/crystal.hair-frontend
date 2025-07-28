<template>
  <AddSrcUrlSubset v-if='store.addSrcUrlSubset'/>
  <OverlayScrollbarsComponent defer>
    <DataView :value="srcUrlSubsets">
      <template #list="slotProps" >
        <div v-for="(item, index) in slotProps.items" :key="index"  @click="toggleLightBox(index)" >
          <div v-if="item.id === 'page-load'" class="nav-loader">
            <img class="nav-loader-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/page-loader.gif" />
          </div>

          <div v-else @click="search(item.id)" class="dgb-nav" style="display: flex; flex-direction: column;}">
            <div class="dgb-0-txt" style="display: flex;" >
              <a class='title font-s-title text text-main-0' style="padding:1px; padding-right:0!important; margin-right: 4px;" >{{item.name}}</a>
              <img class='mix-feed-icon' v-if='feedCheck(item.id)' style="float:right; padding-top: 2px; text-align: end; padding-right:2px;" src="https://crystal-hair.nyc3.digitaloceanspaces.com/feed.png"/>
            </div>
            <div class="dgb-0-txt">
              <a class='descr font-s-descr text text-main-0' style="float:left; width: 50%; padding-left:1px;">{{convertDate(item.time_last_entry)}}</a>
              <a class='descr font-s-descr text text-main-0' style="float:right; text-align: end; width:50%; padding-right:2px;">{{blockCnt(item.content_id)}}</a>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </OverlayScrollbarsComponent>
</template>


<script setup lang="ts">
import DataView from 'primevue/dataview'
import { storeToRefs } from 'pinia'

import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'
import { useConnectionsStore } from '@/stores/api/connectionsStore'
import { useUserFeedStore } from '@/stores/api/UserFeedStore'
import { GlobalStore } from '@/stores/GlobalStore'

import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import AddSrcUrlSubset from '@/components/uploaders/AddSrcUrlSubset.vue'

// Props
const props = defineProps<{ id: number }>()

// Stores
const store = GlobalStore()
const { srcUrlSubsets } = storeToRefs(useSrcUrlSubsetStore())
const connectionsStore = useConnectionsStore()
const userFeedStore = useUserFeedStore()

// Methods
function search(e: string ): void {
  store.srcUrlSubset = store.srcUrlSubset === e ? '-1' : e
  console.log(e)
}

function convertDate(datetime: string): string {
  const now = new Date()
  const date = new Date(datetime)
  const diffMs = now.getTime() - date.getTime()
  const d = Math.trunc(diffMs / 1000 / 60 / 60 / 24)
  const h = Math.trunc(diffMs / 1000 / 60 / 60) - d * 24
  const m = Math.trunc(diffMs / 1000 / 60) - (h * 60) - (d * 24 * 60)
  return `{${d.toString().padStart(2, "0")}: ${h.toString().padStart(2, "0")}: ${m.toString().padStart(2, "0")}}`
}

function blockCnt(content_id: string ): string {
  const contents = connectionsStore.connections_src.find(i => i.id === content_id)
  return contents ? `{${contents.contains[0]}}` : ''
}

const feedCheck = (mix_id: string): boolean =>
  userFeedStore.user_feed.feed_sources.includes(mix_id)
</script>
