<template>
  <div class="lightbox-info">
    <div class="infoCol">
      <div>
        <a v-if="modelValue.url" class="infoBox" :href="modelValue.url" target="_blank">
          <span class="info-title">Url: </span>{{ convertUrl(modelValue.url) }}
        </a>
        <a
          v-if="modelValue.signed_url"
          class="infoBox"
          :href="modelValue.signed_url"
          target="_blank"
        >
          <span class="info-title">File Link: </span
          >{{ modelValue.file_path ? modelValue.file_path : modelValue.signed_url }}
        </a>
        <div v-if="modelValue.time_posted" class="infoBox">
          <a class="info-title">Posted: </a>{{ formatDate(modelValue.time_posted) }}
        </div>
        <div v-if="modelValue.time_scraped" class="infoBox">
          <a class="info-title">Scrape: </a>{{ formatDate(modelValue.time_scraped) }}
        </div>

        <a
          v-if="
            modelValue.url?.includes('tumblr') && modelValue.src_url_subset_id && modelValue.author
          "
          class="infoBox"
          :href="'https://www.tumblr.com/' + modelValue.author"
          target="_blank"
        >
          <span class="info-title">Account: </span>
          {{ getSrcAccount(modelValue.src_url_subset_id) }}
        </a>

        <div v-else-if="modelValue.author" class="infoBox">
          <a class="info-title">Author: </a>
          {{ modelValue.author }}
        </div>

        <a
          v-if="
            modelValue.url?.includes('tumblr') &&
            isOriginAccount(modelValue.src_url_subset_id, modelValue.author)
          "
          class="infoBox"
          :href="'https://www.tumblr.com/' + modelValue.author"
          target="_blank"
        >
          <span class="info-title">Origin Account: </span>{{ modelValue.author }}
        </a>
        <div v-if="modelValue.key_words" class="infoBox">
          <a class="info-title">Key Words: </a>{{ modelValue.key_words }}
        </div>
        <div v-if="(modelValue.hashtags?.length ?? 0) > 0" class="infoBox">
          <a class="info-title">Hashtags: </a>{{ modelValue.hashtags }}
        </div>
        <div v-if="(modelValue.likes?.length ?? 0) > 0" class="infoBox">
          <a class="info-title">Likes: </a> {{ modelValue.likes }}
        </div>
        <div v-if="(modelValue.reposts?.length ?? 0) > 0" class="infoBox">
          <a class="info-title">Reposts: </a>{{ modelValue.reposts }}
        </div>
        <div
          v-if="(modelValue.description?.length ?? 0) > 1"
          class="infoBox"
          style="white-space: normal"
        >
          <a class="info-title">Description: </a>{{ modelValue.description }}
        </div>
      </div>
      <a class="delete" style="margin-top: -0.5px" @click="deleteBlock()">Destroy Kernal</a>
    </div>
    <div class="mixCol">
      <div class="select-mix">
        <DataView class="dg-0" :value="mixes" dataKey="id1">
          <template #list="slotProps">
            <div
              v-for="(item, index) in slotProps.items"
              :key="index"
              style="display: flex"
              class="dgb-0"
            >
              <div
                class="dgb-0-txt"
                @click="useConnectionsStore().patchMixAddKernal(item.id, modelValue.id)"
              >
                <a style="float: left; width: calc(100%); margin-bottom: var(--base-spacing)">{{
                  getName(item.id)
                }}</a>
                <a class="descr" style="float: left">{{ convertDate(item.id) }}</a>
                <a class="descr" style="float: right">{{ blockCnt(item) }} kernals</a>
              </div>
              <img
                @click="search(item.id)"
                id="open-mix"
                src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-open-mixtape.png"
              />
            </div>
          </template>
        </DataView>
      </div>
      <div class="select-mix">
        <DataView class="dg-0" :value="mixesBelong" dataKey="id2">
          <template #list="slotProps">
            <div
              v-for="(item, index) in slotProps.items"
              :key="index"
              style="display: flex"
              class="dgb-0"
            >
              <div
                class="dgb-0-txt"
                @click="useConnectionsStore().patchMixRemKernal(item.id, modelValue.id)"
              >
                <a style="float: left; width: calc(100%); margin-bottom: var(--base-spacing)">{{
                  getName(item.id)
                }}</a>
                <a class="descr" style="float: left">{{ convertDate(item.id) }}</a>
                <a class="descr" style="float: right">{{ blockCnt(item.id) }} kernals</a>
              </div>
              <img
                @click="search(item.id)"
                id="open-mix"
                src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-open-mixtape.png"
              />
            </div>
          </template>
        </DataView>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { kernalType } from '@/types/ApiTypes'
  import { computed } from 'vue'
  import DataView from 'primevue/dataview'
  import { storeToRefs } from 'pinia'
  import { useMixtapeStore } from '@/stores/api/MixtapeStore'
  import { useConnectionsStore } from '@/stores/api/connectionsStore'
  import { useKernalStore } from '@/stores/api/KernalStore'
  import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'
  import { GlobalStore } from '@/stores/GlobalStore'

  const { connections_mix } = storeToRefs(useConnectionsStore())
  const { mixtapes } = storeToRefs(useMixtapeStore())
  const { kernals } = storeToRefs(useKernalStore())
  const store = GlobalStore()
  const srcStore = useSrcUrlSubsetStore()

  const props = withDefaults(
    defineProps<{
      modelValue: kernalType
    }>(),
    {}
  )

  const mixes = computed(() =>
    props.modelValue?.id
      ? connections_mix.value.filter(
          connection => !connection.contains?.includes(props.modelValue.id as string)
        )
      : []
  )
  const mixesBelong = computed(() =>
    props.modelValue?.id
      ? connections_mix.value.filter(connection =>
          connection.contains?.includes(props.modelValue.id as string)
        )
      : []
  )

  // METHODS
  const getName = (content_id: string) => {
    let contents = mixtapes.value.find(i => i.content_id === content_id)
    if (contents != null) {
      return contents.name
    }
    return null
  }

  const convertDate = (content_id: string) => {
    let contents = mixtapes.value.find(i => i.content_id === content_id)
    if (contents != null) {
      let date = contents.updated_at
      const ret =
        date === null
          ? ''
          : ((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)).toFixed(0)
      return ret + ' days ago'
    }
    return null
  }

  const formatDate = (date: Date) => {
    if (date) {
      const d = new Date(date)
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    }
    return ''
  }
  function search(cont_id: string) {
    store.closeViewer()
    let mix = mixtapes.value.find(i => i.content_id === cont_id)
    if (mix != null) {
      store.mixtape = store.mixtape === mix.id ? '' : mix.id
    }
    return null
  }
  const getSrcAccount = (id: string) => {
    let src = srcStore.srcUrlSubsets.find(i => i.id === id)
    if (src != null) {
      return src.name
    }
    return null
  }
  const isOriginAccount = (src_id: string, author: string) => {
    if (src_id && author) {
      let src = srcStore.srcUrlSubsets.find(i => i.id === src_id)
      if (src != null && src.name === author) {
        return false
      }
    }
    return true
  }
  const convertUrl = (url: string) => {
    if (url != null) return url.replace(/(^\w+:|^)\/\/|www.|en.m.|.com\/blog\/view/g, '')
    return null
  }
  const blockCnt = (content_id: string) => {
    let contents = connections_mix.value.find(i => i.id === content_id)
    if (contents != null) {
      return contents.contains.length
    }
    return null
  }
  const deleteBlock = () => {
    if (!props.modelValue.id) return
    useKernalStore().deleteKernal(props.modelValue.id)
    let id = props.modelValue.id
    if (GlobalStore().lightBoxIndex === kernals.value.length - 1 && kernals.value.length - 1 > 0) {
      GlobalStore().lightBoxIndex = GlobalStore().lightBoxIndex - 1
    }
    if (kernals.value.length - 1 === 0) {
      GlobalStore().closeViewer()
    }
  }
</script>
