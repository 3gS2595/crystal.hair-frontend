<template>
  <AddSrcUrlSubset v-if='store.addSrcUrlSubset'/>

  <OverlayScrollbarsComponent defer>
    <DataView class='dg-0' :value="srcUrlSubsets" :layout="list" >
      <template #list="slotProps">

        <div class='nav-loader' v-if="slotProps.data.id === 'page-0'">
          <img class='nav-loader-icon' src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/page-loader.gif"/>
        </div>

        <div @click="search(slotProps.data.id)" class="dgb-nav">
          <div class="dgb-0-txt" style="display: flex;" >
            <a class='title font-s-title text text-main-0' style="padding:1px; padding-right:0!important; margin-right: 4px;" >{{ slotProps.data.name}}</a>
            <a class='descr font-s-descr text text-main-0' style="float:right; padding-top: 2px; max-width: 100%; min-width: fit-content; text-align: end; padding-right:2px;">{{feedCheck(slotProps.data.id)}}</a>
          </div>
          <div class="dgb-0-txt">
            <a class='descr font-s-descr text text-main-0' style="float:left; width: 50%; padding-left:1px;">-{{convertDate(slotProps.data.time_last_entry)}}</a>
            <a class='descr font-s-descr text text-main-0' style="float:right; text-align: end; width:50%; padding-right:2px;">+ {{blockCnt(slotProps.data.content_id)}}</a>
          </div>
        </div>
      </template>
    </DataView>
  </OverlayScrollbarsComponent>
</template>

<script setup lang="ts">
import type { srcUrlSubsetType } from '@/types/ApiTypes'

import { ref, watch, onMounted } from 'vue'
import DataView from 'primevue/dataview'

import { storeToRefs } from 'pinia'
import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'
import { useConnectionsStore } from '@/stores/api/connectionsStore'
import { useUserFeedStore } from '@/stores/api/UserFeedStore'
import { closeExpand } from '@/lib/ResizeContentGrid'
import { GlobalStore } from '@/stores/GlobalStore'
import VueLoadImage from 'vue-load-image'
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";
import AddSrcUrlSubset from '@/components/uploaders/AddSrcUrlSubset.vue'

const { srcUrlSubsets } = storeToRefs(useSrcUrlSubsetStore())

const store = GlobalStore()
const props = defineProps<{
  id: number
}>()

const search = (e) => {
  //if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) { closeExpand() }
  if(JSON.stringify(store.srcUrlSubset) === JSON.stringify(e)) {
    store.srcUrlSubset = '-1'
  }else {
    store.srcUrlSubset = e
    console.log(e)
  }
}
const convertDate = (datetime) => {
  const d = Math.trunc((new Date() - new Date(datetime))/1000/60/60/24)
  const h = Math.trunc((new Date() - new Date(datetime))/1000/60/60) - (d * 24)
  const m = Math.trunc((new Date() - new Date(datetime) )/1000/60) - (h * 60) - (d * 24 * 60)
  if (h == 0 && d == 0) return (m + ' mins ')
  if (d == 0) return (h + ' hrs ')
  return (d + ' days ')
}
const blockCnt = (content_id) => {
  let contents = useConnectionsStore().connections_src.find(i => i.id === content_id)
  if(contents != null) {return contents.contains[0]}
  return null
}
const feedCheck = (mix_id) => {
  return (useUserFeedStore().user_feed.feed_sources.includes(mix_id)) ? '(feed)' : null
}
</script>
