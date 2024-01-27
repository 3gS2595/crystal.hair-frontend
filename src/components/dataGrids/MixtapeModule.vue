<template>
  <AddMixtapeBox v-if='store.addMixtapeBoxView'/>
  <EditMixtapeBox v-if='store.editMixtapeBoxView'/>
  <div class="mixtapeView">
    <OverlayScrollbarsComponent defer>
      <DataView class='dg-0' :value="mixtapes" :layout="list" >
        <template #list="slotProps">

          <vue-load-image v-if="slotProps.data.id === 'page-0'">
            <template v-slot:image>
              <img style=" height: 100px;" class="thumbnail" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/page-loader.gif"/>
            </template>
            <template v-slot:preloader>
              <div class="loading"/>
            </template>
            <template v-slot:error>
              <div>*Image load error</div>
            </template>
          </vue-load-image>

          <div @click="search(slotProps.data.id)" class="dgb-mixtape" v-else>
            <div class="dgb-0-txt" style="display: flex;" >
              <a class='title font-s-title text text-main-0' style="padding:1px; padding-right:0!important; margin-right: 4px;" >{{ convertTitle(slotProps.data.name) }}</a>
              <a class='descr font-s-descr text text-main-0' style="float:right; padding-top: 2px; max-width: 100%; min-width: fit-content; text-align: end; padding-right:2px;">{{feedCheck(slotProps.data.id)}}</a>
            </div>
            <div class="dgb-0-txt">
              <a class='descr font-s-descr text text-main-0' style="float:left; width: 50%; padding-left:1px;">-{{convertDate(slotProps.data.content_id)}}</a>
              <a class='descr font-s-descr text text-main-0' style="float:right; text-align: end; width:50%; padding-right:2px;">+ {{blockCnt(slotProps.data.content_id)}}</a>
            </div>
          </div>
        </template>
      </DataView>
    </OverlayScrollbarsComponent>
  </div>
</template>

<script setup lang="ts">
import type { mixtapeType } from '@/assets/types/ApiTypes'

import { ref, watch, onMounted } from 'vue'
import DataView from 'primevue/dataview'

import { storeToRefs } from 'pinia'
import { useMixtapeStore } from '@/services/api/MixtapeStore'
import { useConnectionsStore } from '@/services/api/connectionsStore'
import { useUserFeedStore } from '@/services/api/UserFeedStore'
import { GlobalStore } from '@/services/GlobalStore'
import VueLoadImage from 'vue-load-image'
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";
import AddMixtapeBox from '@/components/uploaders/AddMixtape.vue'
import EditMixtapeBox from '@/components/editViewers/EditBox.vue'

const { mixtapes} = storeToRefs(useMixtapeStore())

const store = GlobalStore()
const props = withDefaults(defineProps<{
  id: number
}> (), {
  id:-1
})

const search = (e) => {
  if(JSON.stringify(store.mixtape) === JSON.stringify(e)) {
    store.mixtape = ''
  }else {
    store.mixtape = e
  }
}
const convertTitle = (title) => {
  if (title !== null){
    title = title.replace(/^\s+|\s+$/gm,'')
    return title
  }
}
const convertDate = (contents_id) => {
  if (useConnectionsStore().connections_mix.find(i => i.id === contents_id) != undefined){
    let datetime = useConnectionsStore().connections_mix.find(i => i.id === contents_id).updated_at
    const d = Math.trunc((new Date() - new Date(datetime))/1000/60/60/24)
    const h = Math.trunc((new Date() - new Date(datetime))/1000/60/60) - (d * 24)
    const m = Math.trunc((new Date() - new Date(datetime) )/1000/60) - (h * 60) - (d * 24 * 60)
    if (h == 0 && d == 0) {return (m + ' mins')}
    if (d == 0) {return (h + ' hrs')}
    return (d + ' days')
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
