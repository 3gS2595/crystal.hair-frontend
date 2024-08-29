<template>
  <div class='overlay'>
    <div class='edit-mixtape' v-click-away='close'>
        <div class="add-mixtape-title" >
          <a class="input-name text-main-0 edit-opt">id:</a>
          <a class="input-standard text-main-0 edit-opt input-name-static" v-if="store.srcUrlSubset != ''">{{ title }}</a>
          <input class="input-standard text-main-0 edit-opt" v-if="store.mixtape != ''" placeholder="null" v-model="title">
        </div>
        <div class='add-mixtape-options'>
          <a class="option text-main-0 edit-opt" @click="deleteMixSrc">delete</a>
          <a class='option text-main-0 edit-opt' @click='close'>exit</a>
          <a class='option text-main-0 edit-opt' v-if="store.mixtape != ''" @click='submitFile'>save</a>
        </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, onUnmounted, ref } from "vue";
import { directive as ClickAway } from 'vue3-click-away'
import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'
import { GlobalStore } from '@/stores/GlobalStore'
import { useMixtapeStore } from '@/stores/api/MixtapeStore'

onMounted(() => window.addEventListener("keyup", esc));
onUnmounted(() => window.removeEventListener("keyup", esc));
const store = GlobalStore()
const mixtapeStore = useMixtapeStore()
const index = mixtapeStore.mixtapes.findIndex(x => x.id === store.mixtape)
const sindex = useSrcUrlSubsetStore().srcUrlSubsets.findIndex(x => x.id === store.srcUrlSubset)

let title = ref()
if (store.mixtape != '') {
  title = ref(mixtapeStore.mixtapes[index].name)
} else {
  title = useSrcUrlSubsetStore().srcUrlSubsets[sindex].name
}

const deleteMixSrc = () => {
  if (store.srcUrlSubset != '-1' && store.srcUrlSubset != '') {
    useSrcUrlSubsetStore().deleteSrcUrlSubset(store.srcUrlSubset)
  } else if (store.mixtape != '') {
    mixtapeStore.deleteMixtape(store.mixtape)
  }
  store.editMixtapeBoxView = false
}

const submitFile = () => {
  mixtapeStore.patchMixtape(store.mixtape, title.value)
  store.editMixtapeBoxView = false
}

const esc  = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    close()
  }
}

const close = () => {
  store.editMixtapeBoxView = false
}

defineProps()
defineEmits()
</script>

<script lang='ts'>
import { directive as ClickAway } from 'vue3-click-away'

export default {
  directives: {
    ClickAway
  }
}
</script>
