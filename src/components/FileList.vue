<template>
  <EditMixtapeBox v-if='globalStore.editMixtapeBoxView'/>

  <OverlayScrollbarsComponent defer>
    <AddMixtapeBox v-if='globalStore.addMixtapeBoxView'/>
    <vue3-tree-vue :items="items"
      :isCheckable="false"  //Set to true if you want to get checkable items
      :hideGuideLines="false"
      @onCheck="onItemChecked"
      @dropValidator="onBeforeItemDropped"
      @onSelect="onItemSelected"
      @onExpanded="lazyLoadNode"
      >
    </vue3-tree-vue>
  </OverlayScrollbarsComponent>
</template>

<script setup lang="ts">
import type { mixtapeType } from '@/types/ApiTypes'

import { ref, watch, onMounted } from 'vue'
import 'vue3-tree-vue/dist/style.css'

import { useMixtapeStore } from '@/stores/api/MixtapeStore'
import { useConnectionsStore } from '@/stores/api/connectionsStore'
import { useUserFeedStore } from '@/stores/api/UserFeedStore'
import { closeExpand } from '@/lib/ResizeContentGrid'
import { GlobalStore } from '@/stores/GlobalStore'
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";
import AddMixtapeBox from '@/components/uploaders/AddMixtape.vue'
import EditMixtapeBox from '@/components/editViewers/EditBox.vue'

const mixtapeStore = useMixtapeStore()
const globalStore = GlobalStore()

interface TreeViewItem {
  name: string;
  id?: string | number;
  children?: TreeViewItem[];
  checked?: boolean;
  selected?: boolean;
  expanded?: boolean;
  disabled?: boolean;// When disabled, an item can neither be selected or checked
  meta?: any;// provides meta-data of any type per node.
}
const items = ref<TreeViewItem[]>([])

const onItemSelected = (e) => {
  if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) { closeExpand() }
  if(JSON.stringify(globalStore.mixtape) === JSON.stringify(e)) { globalStore.mixtape = '' }
  else { globalStore.mixtape = e }
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
