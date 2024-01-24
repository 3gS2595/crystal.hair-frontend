<template>
  <div class="mixtapeView">
    <OverlayScrollbarsComponent defer>
      <DataView class='dg-0' :value="folders" :layout="list" >
        <template #list="slotProps">
          <div @click="search(slotProps.data.id)" class="dgb-src-url-subset">
            <div class="dgb-0-txt" style="display: flex;" >
              <a class='title font-s-title text text-main-0' style="padding:1px; padding-right:0!important; margin-right: 4px;" >{{ slotProps.data.name}}</a>
              <a class='descr font-s-descr text text-main-0' style="float:right; padding-top: 2px; max-width: 100%; min-width: fit-content; text-align: end; padding-top: 2px;  padding-right:2px;">(folder)</a>
            </div>
            <div class="dgb-0-txt">
              <a class='descr font-s-descr text text-main-0' style="float:left; width: 50%; padding-left:1px;">-{{convertDate(slotProps.data.updated_at)}}</a>
              <a class='descr font-s-descr text text-main-0' style="float:right; text-align: end; width:50%; padding-right:2px;">+ {{blockCnt(slotProps.data.contains)}}</a>
            </div>
          </div>
        </template>
      </DataView>
    </OverlayScrollbarsComponent>
  </div>
</template>

<script setup lang="ts">

import { ref, watch, onMounted } from 'vue'
import DataView from 'primevue/dataview'

import { storeToRefs } from 'pinia'
import { useFolderStore } from '@/services/api/FolderStore'
import { useConnectionsStore } from '@/services/api/connectionsStore'
import { useUserFeedStore } from '@/services/api/UserFeedStore'
import { GlobalStore } from '@/services/GlobalStore'
import VueLoadImage from 'vue-load-image'
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";

const { folders } = storeToRefs(useFolderStore())

const pageNumber = ref<number>(2)
const store = GlobalStore()
const props = withDefaults(defineProps<{
  id: number
}> (), {
  id:-1
})

const convertDate = (datetime) => {
  const d = Math.trunc((new Date() - new Date(datetime))/1000/60/60/24)
  const h = Math.trunc((new Date() - new Date(datetime))/1000/60/60) - (d * 24)
  const m = Math.trunc((new Date() - new Date(datetime) )/1000/60) - (h * 60) - (d * 24 * 60)

  if (h == 0 && d == 0){
    return (m + ' mins ')
  }
  if (d == 0){
    return (h + ' hrs ')
  }
  return (d + ' days ')
}

const blockCnt = (contains) => {
  if(contains != null) {return contains.length}
  return null
}
</script>
