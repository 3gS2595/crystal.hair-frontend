<template>
  <div class='lightbox-info'>
    <div class="infoCol">
      <div>
      <a v-if="modelValue.url" class="infoBox" :href="modelValue.url" target="_blank">
        <span class="info-title">url: </span>{{convertUrl(modelValue.url)}}
       </a>
      <div v-if="modelValue.description" class="infoBox"><a class="info-title">description: </a>{{modelValue.description}}</div>
      <div v-if="modelValue.time_posted" class="infoBox"><a class="info-title">time_posted: </a>{{modelValue.time_posted}}</div>
      <div v-if="modelValue.created_at" class="infoBox"><a class="info-title">created_at: </a>{{modelValue.created_at}}</div>
      <div v-if="modelValue.author" class="infoBox"><a class="info-title">author: </a>{{modelValue.author}}</div>
      <div v-if="modelValue.time_scraped" class="infoBox"><a class="info-title">time_scraped: </a>{{modelValue.time_scraped}}</div>
      <div v-if="modelValue.key_words" class="infoBox"><a class="info-title">key_words: </a>{{modelValue.key_words}}</div>
      <div v-if="modelValue.hashtags.length > 0" class="infoBox"><a class="info-title">hashtags: </a>{{modelValue.hashtags}}</div>
      <div v-if="modelValue.likes.length > 0" class="infoBox"><a class="info-title">likes: </a> {{modelValue.likes}}</div>
      <div v-if="modelValue.reposts.length > 0" class="infoBox"><a class="info-title">reposts: </a>{{modelValue.reposts}}</div>
      <div v-if="modelValue.file_type" class="infoBox"><a class="info-title">file_type: </a>{{modelValue.file_type}}</div>
      <a class="infoBox" :href="modelValue.signed_url" target="_blank">
          <span class="info-title">file_link: </span>{{modelValue.file_path ? modelValue.file_path : modelValue.signed_url}}
      </a>
      <div class="infoBox"></div>
    </div>
    <a class='delete' style="margin-top:-.5px;" @click='deleteBlock()'>Destroy Kernal</a>
    </div>
    <div class="mixCol">
      <div class="select-mix">
        <DataView class='dg-0' :value="mixes" dataKey="id1">
          <template #list="slotProps">
            <div v-for="(item, index) in slotProps.items" :key="index" style='display: flex;' class="dgb-0">
              <div class="dgb-0-txt" @click="useConnectionsStore().patchMixAddKernal(item.id, modelValue.id)">
                <a style="float:left; width:calc(100%); margin-bottom:var(--base-spacing);">{{ getName(item.id) }}</a>
                <a class='descr' style="float:left;">{{ convertDate(item.id) }}</a>
                <a class='descr' style="float:right;">{{ blockCnt(item) }} kernals</a>
              </div>
              <img @click="search(item.id)" id='open-mix' src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-open-mixtape.png"/>
            </div>
          </template>
        </DataView>
      </div>
      <div class="select-mix">

        <DataView class='dg-0' :value="mixesBelong" dataKey="id2">
          <template #list="slotProps" >
            <div v-for="(item, index) in slotProps.items" :key="index" style='display: flex;' class="dgb-0">
              <div class='dgb-0-txt' @click="useConnectionsStore().patchMixRemKernal(item.id, modelValue.id)">
                <a style="float:left; width:calc(100%); margin-bottom:var(--base-spacing);">{{ getName(item.id) }}</a>
                <a class='descr' style="float:left;">{{ convertDate(item.id) }}</a>
                <a class='descr' style="float:right;">{{ blockCnt(item.id) }} kernals</a>
              </div>
              <img @click="search(item.id)" id='open-mix' src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-open-mixtape.png"/>
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
const store = GlobalStore()

const props = withDefaults(defineProps<{
  modelValue: kernalType,
}> (), {})

const mixes = computed(() => connections_mix.value.filter(connections => !connections.contains.includes(props.modelValue.id)))
const mixesBelong = computed(() => connections_mix.value.filter(connections => connections.contains.includes(props.modelValue.id)))

const getName = (content_id: string) => {
  let contents = mixtapes.value.find(i => i.content_id === content_id)
  if(contents != null) {return contents.name}
  return null
}
const convertDate = (content_id: string) => {
  let contents = mixtapes.value.find(i => i.content_id === content_id)
  if(contents != null) {
    let date = contents.updated_at
    const ret = (date === null) ? null:((new Date() - new Date(date))/1000/60/60/24).toFixed(0)
    return ret + ' days ago'
  }
  return null
}

function search(cont_id) {
  store.closeViewer()
  let id = mixtapes.value.find(i => i.content_id === cont_id).id
  store.mixtape = store.mixtape === id ? '' : id
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
