<template>
  <AddContentBox v-if="toggle_upload" @close="handleOverlayClose" />
  <div class="tabs tabs-content">
    <div class="tabs-l">
      <div
        v-if="store.mixtape !== ''"
        class="tab tab-active tab-width-standard media-active"
        @click="toggle_upload = !toggle_upload"
      >
        <img
          class="tab-icon"
          src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-new.png"
        />
      </div>
      <div
        :class="{ 'tab-active media-active': store.feed === true }"
        class="tab tab-width-standard"
        @click="store.feed = true"
      >
        <img
          class="tab-icon tab-icon-media"
          src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-mix.png"
        />
      </div>
      <div
        :class="{ 'tab-active media-active': store.feed === false }"
        class="tab tab-width-standard"
        @click="store.feed = false"
      >
        <img
          class="tab-icon tab-icon-media"
          src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-settings.png"
        />
      </div>

      <a v-if="mixtapeHeader" class="tab tab-active current-dir" @click="store.closeHeader">{{
        mixtapeHeader
      }}</a>

      <a v-if="store.tags !== ''" class="tab tab-active current-dir" @click="store.tags = ''">{{
        store.tags
      }}</a>

      <a
        v-if="store.filter !== ''"
        class="tab tab-active current-dir"
        @click="() => (store.filter = '')"
        >{{ store.filter }}</a
      >
    </div>

    <div class="tabs-r"></div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { GlobalStore } from '@/stores/GlobalStore'
  import { useMixtapeStore } from '@/stores/api/MixtapeStore'
  import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'
  import AddContentBox from '@/components/molecules/overlayBox/AddContent.vue'

  // Pinia stores
  const store = GlobalStore()
  const { mixtapes, srcUrlSubsets } = {
    ...storeToRefs(store),
    ...storeToRefs(useMixtapeStore()),
    ...storeToRefs(useSrcUrlSubsetStore()),
  }

  // Watchers to update mixtapeHeader based on changes
  const mixtapeHeader = computed(() => {
    const mixtapeObj = mixtapes.value.find(m => m.id === store.mixtape)
    const srcSubsetObj = srcUrlSubsets.value.find(s => s.id === store.srcUrlSubset)
    return mixtapeObj?.name || srcSubsetObj?.name || ''
  })

  const toggle_upload = ref(false)
  function handleOverlayClose() {
    toggle_upload.value = false
  }
</script>
