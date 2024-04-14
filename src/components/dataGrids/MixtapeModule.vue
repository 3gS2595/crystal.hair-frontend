<template>
  <EditMixtapeBox v-if='globalStore.editMixtapeBoxView'/>

  <OverlayScrollbarsComponent defer>
    <AddMixtapeBox v-if='globalStore.addMixtapeBoxView'/>
    <DataView class='dg-0' :value="mixtapeStore.mixtapes" :layout="list" >
      <template #list="slotProps">

        <div class='nav-loader' v-if="slotProps.data.id === 'page-0'">
          <img class='nav-loader-icon' src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/page-loader.gif"/>
        </div>

        <div @click="search(slotProps.data.id)" class="dgb-nav" v-else>
          <div class="dgb-0-txt" style="display: flex;" >
            <a class='title font-s-title text text-main-0' style="padding:1px; padding-right:0!important; margin-right: 4px;" >{{ slotProps.data.name }}</a>
            <img class='mix-feed-icon' v-if='feedCheck(slotProps.data.id)' style="float:right; padding-top: 2px; text-align: end; padding-right:2px;" src="https://crystal-hair.nyc3.digitaloceanspaces.com/feed.png"/>
          </div>
          <div class="dgb-0-txt">
            <a class='descr font-s-descr text text-main-0' style="float:left; width: 50%; padding-left:1px;">{{convertDate(slotProps.data.content_id)}}</a>
            <a class='descr font-s-descr text text-main-0' style="float:right; text-align: end; width:50%; padding-right:2px;">{{convertCount(blockCnt(slotProps.data.content_id))}}</a>
          </div>
        </div>
      </template>
    </DataView>
  </OverlayScrollbarsComponent>
</template>

<script setup lang="ts">
import type { mixtapeType } from '@/types/ApiTypes'

import { ref, watch, onMounted } from 'vue'
import DataView from 'primevue/dataview'

import { useMixtapeStore } from '@/stores/api/MixtapeStore'
import { useConnectionsStore } from '@/stores/api/connectionsStore'
import { useUserFeedStore } from '@/stores/api/UserFeedStore'
import { closeExpand } from '@/lib/ResizeContentGrid'
import { GlobalStore } from '@/stores/GlobalStore'
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";
import AddMixtapeBox from '@/components/uploaders/AddMixtape.vue'
import EditMixtapeBox from '@/components/dataEditors/EditBox.vue'

const mixtapeStore = useMixtapeStore()
const globalStore = GlobalStore()
const feedStore = useUserFeedStore()
const props = defineProps<{
  id: number
}>()

const search = (e) => {
  // if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) { closeExpand() }
  if(JSON.stringify(globalStore.mixtape) === JSON.stringify(e)) { globalStore.mixtape = '' }
  else { globalStore.mixtape = e }
}
const convertCount = (count) => {
  if (count != null) {
    return ('{' + count)
  } else {
    return ' '
  }
}
const convertDate = (contents_id) => {
  if (useConnectionsStore().connections_mix.find(i => i.id === contents_id) != undefined){
    let datetime = useConnectionsStore().connections_mix.find(i => i.id === contents_id).updated_at
    const d = Math.trunc((new Date() - new Date(datetime))/1000/60/60/24)
    const h = Math.trunc((new Date() - new Date(datetime))/1000/60/60) - (d * 24)
    const m = Math.trunc((new Date() - new Date(datetime) )/1000/60) - (h * 60) - (d * 24 * 60)
    return ('{' + d.toString().padStart(2, "0")
      + ': ' + h.toString().padStart(2, "0")
      + ': ' + m.toString().padStart(2, "0"))
  } else {
    return '{'
  }
}
const feedCheck = (mix_id) => {
  return (useUserFeedStore().user_feed.feed_mixtape.includes(mix_id)) ? '(feed)' : null
}
const blockCnt = (content_id) => {
  let contents = useConnectionsStore().connections_mix.find(i => i.id === content_id)
  if(contents != null) {return contents.contains.length}
  return null
}
</script>
