<template>
  <div class='lightbox-info'>
    <div class="infoCol">
      <a class="infoBox" :href="modelValue.url" target="_blank">url: {{modelValue.url}}</a>
      <div class="infoBox">description: {{modelValue.description}}</div>
      <div class="infoBox">time_posted: {{modelValue.time_posted}}</div>
      <div class="infoBox">created_at: {{modelValue.created_at}}</div>
      <div class="infoBox">author: {{modelValue.author}}</div>
      <div class="infoBox">time_scraped: {{modelValue.time_scraped}}</div>
      <div class="infoBox">key_words: {{modelValue.key_words}}</div>
      <div class="infoBox">hashtags: {{modelValue.hashtags}}</div>
      <div class="infoBox">likes: {{modelValue.likes}}</div>
      <div class="infoBox">reposts: {{modelValue.reposts}}</div>
      <div class="infoBox">file_name: {{modelValue.file_name}}</div>
      <div class="infoBox">file_type: {{modelValue.file_type}}</div>
      <div class="infoBox">file_path: {{modelValue.file_path}}</div>
      <div class="infoBox"></div>
      <div class="infoBox">id: {{modelValue.id}}</div>
      <div class="infoBox">src_url: {{modelValue.src_url}}</div>
      <div class="infoBox">src_url_subset: {{modelValue.src_url_subset_id}}</div>

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
    console.log(date)
    const ret = (date === null) ? null:((new Date() - new Date(date))/1000/60/60/24).toFixed(0)
    return ret + ' days ago'
  }
  return null
}
const blockCnt = (content_id) => {
  let contents = connections_mix.value.find(i => i.id === content_id)
  if(contents != null) {return contents.contains.length}
  return null
}
const deleteBlock = () => {
  let id = props.modelValue.id
  console.log(GlobalStore().lightBoxIndex)
  console.log(kernals.value.length - 1)
  if(GlobalStore().lightBoxIndex === kernals.value.length - 1 && kernals.value.length - 1 > 0) {
    GlobalStore().lightBoxIndex = GlobalStore().lightBoxIndex - 1
  }
  if (kernals.value.length - 1 === 0) {
    GlobalStore().closeViewer()
  }
  useKernalStore().deleteKernal(props.modelValue.id)
}
</script>

<style>
  .lightbox-info {
    background: var(--background-lightbox);
    position:absolute;
    border: 1px solid var(--border-primary);
    backdrop-filter: blur(20px);
    bottom: 50px;
    left: 50%;
    transform: translate(-50%, -0);
    width: 90%;
    max-width:800px;
    height: 40%;
    display:flex;

    .mixCol{
      display:flex;
      width:60%;
      height:100%;
      .select-mix{
        height:100%;
        width:50%;
        border-left:1px solid var(--border-primary);
        width:50%;
      }
    }


    .infoCol{
      border:1px solid var(--border-mix);
      width:39%;
      height:calc(100% - 8px);
      margin:var(--box-margin);
      padding:var(--box-margin);
      overflow: auto;
    .infoBox{
        width:100%;
        overflow: hidden;
        min-height: 16px;
        white-space: nowrap;
        display:block;
      }
    }
 .p-dataview{
      height:100%;
      width:100%;

      .p-dataview-content{
        height:100%;
        width:100%;
        padding-top:4px;
        z-index: 10;
        position: sticky;

        .grid{
          position:relative;
          z-index:5;
          width:100%;
          max-height:calc(100% );
          overflow-y:auto;
          overflow-x:hidden;

          .dgb-0:last-child{
            margin-bottom:40px;
          }
          .dgb-0{
            position: relative;
            cursor: pointer;
            height:fit-content;
            padding:3px;
            overflow:hidden;
            border:1px solid var(--border-mix);
            width:100%;
            margin: 4px;
            margin-top:0;
            margin-bottom:1px;

            .dgb-0-txt{
              cursor: pointer;
              width:100%;
              margin: 0;
              border:0;
              user-select: none;
              background:none;
              .descr{
                color:var(--text-data-title);
                opacity:.50;
                font-size:12px;
              }

              a{
                color:var(--text-data-title);
                font-size:16px;
                text-align:left;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }

  }

</style>
