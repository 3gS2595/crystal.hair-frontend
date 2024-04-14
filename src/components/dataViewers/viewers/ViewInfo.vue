<template>
  <div class='lightbox-info'>
    <div class="infoCol">
      <a class="infoBox" :href="modelValue.url" target="_blank"><a class="info-title">url: </a>{{convertUrl(modelValue.url)}}</a>
      <div class="infoBox"><a class="info-title">description: </a>{{modelValue.description}}</div>
      <div class="infoBox"><a class="info-title">time_posted: </a>{{modelValue.time_posted}}</div>
      <div class="infoBox"><a class="info-title">created_at: </a>{{modelValue.created_at}}</div>
      <div class="infoBox"><a class="info-title">author: </a>{{modelValue.author}}</div>
      <div class="infoBox"><a class="info-title">time_scraped: </a>{{modelValue.time_scraped}}</div>
      <div class="infoBox"><a class="info-title">key_words: </a>{{modelValue.key_words}}</div>
      <div class="infoBox"><a class="info-title">hashtags: </a>{{modelValue.hashtags}}</div>
      <div class="infoBox"><a class="info-title">likes: </a> {{modelValue.likes}}</div>
      <div class="infoBox"><a class="info-title">reposts: </a>{{modelValue.reposts}}</div>
      <div class="infoBox"><a class="info-title">file_name: </a>{{modelValue.file_name}}</div>
      <div class="infoBox"><a class="info-title">file_type: </a>{{modelValue.file_type}}</div>
      <div class="infoBox"><a class="info-title">file_path: </a>{{modelValue.file_path}}</div>
      <div class="infoBox"><a class="info-title">id: </a>{{modelValue.id}}</div>
      <div class="infoBox"><a class="info-title">src_url: </a>{{modelValue.src_url}}</div>
      <div class="infoBox"><a class="info-title">src_url_subset: </a>{{modelValue.src_url_subset_id}}</div>
      <div class="infoBox"></div>
      <div class="infoBox"></div>
    <a class='delete' style="margin-top:-.5px;" @click='deleteBlock(modelValue.id)'>Destroy Kernal</a>
    </div>
    <div class="mixCol">
      <div class="select-mix">
        <DataView class='dg-0' :value="mixes" :layout="list" >
          <template #list="slotProps">
            <div @click="useConnectionsStore().patchMixAddKernal(slotProps.data.id, modelValue.id)" class="dgb-0">
              <div class="dgb-0-txt">
                <a style="float:left; width:calc(100%); margin-bottom:2px;">{{ getName(slotProps.data.id) }}</a>
                <a class='descr' style="float:left;">{{ convertDate(slotProps.data.id) }}</a>
                <a class='descr' style="float:right;">{{ blockCnt(slotProps.data.id) }} kernals</a>
              </div>
            </div>
          </template>
        </DataView>
      </div>
      <div class="select-mix">
        <DataView class='dg-0' :value="mixesBelong" :layout="list" >
          <template #list="slotProps">
            <div @click="useConnectionsStore().patchMixRemKernal(slotProps.data.id, modelValue.id)" class="dgb-0">
              <div class='dgb-0-txt'>
                <a style="float:left; width:calc(100%); margin-bottom:2px;">{{ getName(slotProps.data.id) }}</a>
                <a class='descr' style="float:left;">{{ convertDate(slotProps.data.id) }}</a>
                <a class='descr' style="float:right;">{{ blockCnt(slotProps.data.id) }} kernals</a>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import type { kernalType } from '@/types/ApiTypes'
import { ref, computed, defineComponent, type PropType } from 'vue'
import DataView from 'primevue/dataview'
import { storeToRefs } from 'pinia'
import { useMixtapeStore } from '@/stores/api/MixtapeStore'
import { useConnectionsStore } from '@/stores/api/connectionsStore'
import { useKernalStore } from '@/stores/api/KernalStore'
import { GlobalStore } from '@/stores/GlobalStore'

const { connections_mix } = storeToRefs(useConnectionsStore())
const { mixtapes } = storeToRefs(useMixtapeStore())
const { kernals } = storeToRefs(useKernalStore())

const props = withDefaults(defineProps<{
  modelValue: kernalType,
}> (), {})

const mixes = computed(() => connections_mix.value.filter(connections => !connections.contains.includes(props.modelValue.id)))
const mixesBelong = computed(() => connections_mix.value.filter(connections => connections.contains.includes(props.modelValue.id)))

const getName = (content_id) => {
  let contents = mixtapes.value.find(i => i.content_id === content_id)
  if(contents != null) {return contents.name}
  return null
}
const convertDate = (content_id) => {
  let contents = mixtapes.value.find(i => i.content_id === content_id)
  if(contents != null) {
    let date = contents.updated_at
    const ret = (date === null) ? null:((new Date() - new Date(date))/1000/60/60/24).toFixed(0)
    return ret + ' days ago'
  }
  return null
}
const convertUrl = (url) => {
  if (url != null) return url.replace(/(^\w+:|^)\/\/|www.|en.m.|.com\/blog\/view/g, '')
  return null
}
const blockCnt = (content_id) => {
  let contents = connections_mix.value.find(i => i.id === content_id)
  if(contents != null) {return contents.contains.length}
  return null
}
const deleteBlock = () => {
  useKernalStore().deleteKernal(props.modelValue.id)
  let id = props.modelValue.id
  if(GlobalStore().lightBoxIndex === kernals.value.length - 1 && kernals.value.length - 1 > 0) {
    GlobalStore().lightBoxIndex = GlobalStore().lightBoxIndex - 1
  }
  if (kernals.value.length - 1 === 0) {
    GlobalStore().closeViewer()
  }
}
</script>
