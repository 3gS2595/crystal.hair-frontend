<template>
  <AddMixtapeBox v-if='store.addMixtapeBoxView'/>
  <AddFolderBox v-if='store.addFolderBoxView'/>
  <EditMixtapeBox v-if="store.editMixtapeBoxView" />

  <OverlayScrollbarsComponent defer>
  <Draggable ref="tree" id='tree' class="mtl-tree" v-model="this.treeData" :indent="27" treeLine>
    <template #default="{ node, stat }">
      <OpenIcon
        v-if="stat.children.length"
        :open="stat.open"
        class="mtl-mr"
        @click.native="stat.open = !stat.open"
      />
      <span class="mtl-ml" @click="search(node.text)">{{ node.text }}</span>
    </template>
  </Draggable>
  </OverlayScrollbarsComponent>
</template>

<script lang='ts'>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { BaseTree, Draggable, pro, OpenIcon } from '@he-tree/vue'
  import '@he-tree/vue/style/default.css'
  import '@he-tree/vue/style/material-design.css'
  import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

  import { useMixtapeStore } from '@/stores/api/MixtapeStore'
  import { useFolderStore } from '@/stores/api/FolderStore'
  import { GlobalStore } from '@/stores/GlobalStore'
  import AddMixtapeBox from '@/components/uploaders/AddMixtape.vue'
  import EditMixtapeBox from '@/components/dataEditors/EditBox.vue'
  import AddFolderBox from '@/components/uploaders/AddFolder.vue'

  export default {
    components: { Draggable, OpenIcon, AddMixtapeBox, EditMixtapeBox, AddFolderBox, OverlayScrollbarsComponent },
    props: ['treeData'],
    methods: {
      search(i: string){
        if (useMixtapeStore().mixtapes.findIndex(x => x.name === i) != -1){
          let id = useMixtapeStore().mixtapes[useMixtapeStore().mixtapes.findIndex(x => x.name === i)].id
          if (JSON.stringify(GlobalStore().mixtape) === JSON.stringify(id)) {
            GlobalStore().mixtape = ''
          } else {
            GlobalStore().mixtape = id
          }
        } else if (useFolderStore().folders.findIndex(x => x.name === i) != -1) {
          let id = useFolderStore().folders[useFolderStore().folders.findIndex(x => x.name === i)].id

        }
      }
    },
    data() {
      return {
        store: GlobalStore()
      }
    }
  }
</script>
