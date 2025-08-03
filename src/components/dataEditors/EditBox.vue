<template>
  <div class='overlay'>
    <div class='edit-mixtape' v-click-away='close'>
      <div v-if="store.mixtape != ''" >
        <div class="mixCol">
          <div class="select-mix">
            <DataView class='dg-0' :value="mixes" :layout="list" >
              <template #list="slotProps" >
                <div v-for="(item, index) in slotProps.items" :key="index"  @click="useConnectionsStore().patchMixAddKernal(item.id, modelValue.id)" class="dgb-0">
                  <div class="dgb-0-txt">
                    <a style="float:left; width:calc(100%); margin-bottom:2px;">{{ getName(item.id) }}</a>
                    <a class='descr' style="float:left;">{{ convertDate(item.id) }}</a>
                    <a class='descr' style="float:right;">{{ blockCnt(item.id) }} kernals</a>
                  </div>
                </div>
              </template>
            </DataView>
          </div>
          <div class="select-mix">

            <DataView class='dg-0' :value="mixesBelong" :layout="list" >
              <template #list="slotProps" >
                <div v-for="(item, index) in slotProps.items" :key="index"  @click="useConnectionsStore().patchMixRemKernal(item.id, modelValue.id)" class="dgb-0">
                  <div class='dgb-0-txt'>
                    <a style="float:left; width:calc(100%); margin-bottom:2px;">{{ getName(item.id) }}</a>
                    <a class='descr' style="float:left;">{{ convertDate(item.id) }}</a>
                    <a class='descr' style="float:right;">{{ blockCnt(item.id) }} kernals</a>
                  </div>
                </div>
              </template>
            </DataView>
          </div>
        </div>
      </div>
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
