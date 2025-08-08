<template>
  <OverlayBox>
    <div id="edit-mix-overlay" style="display: flex; flex-direction: column;"  v-click-away="close">
      <div id="edit-mix-trees" style="display: flex; flex-direction: row; height: 100%;">
        <NavTreeModule
          :treeData="getNonAssignedFolders(mixtapeStore.mixtapeTree)"
          :onNodeClick="onNodeClick"
          id="edit-folder-tree"
        />
        <NavTreeModule
          :treeData="getMixFolderAssignments(mixtapeStore.mixtapeTree)"
          :onNodeClick="onNodeClick"
          id="edit-folder-tree"
        />
      </div>
      <div class="edit-mixtape">
        <div class="add-mixtape-title">
          <a class="input-name text-main-0 edit-opt">id:</a>
          <a
            class="input-standard text-main-0 edit-opt input-name-static"
            v-if="store.srcUrlSubset != ''"
          >{{ title }}</a
          >
          <input
            class="input-standard text-main-0 edit-opt"
            v-if="store.mixtape != ''"
            placeholder="null"
            v-model="title"
          />
        </div>
        <div class="add-mixtape-options">
          <a class="option text-main-0 edit-opt" @click="deleteMixSrc">delete</a>
          <a class="option text-main-0 edit-opt" @click="close">exit</a>
          <a class="option text-main-0 edit-opt" v-if="store.mixtape != ''" @click="submitFile"
          >save</a
          >
        </div>
      </div>
    </div>
  </OverlayBox>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref, inject,  onBeforeUnmount } from 'vue'
  import { useConnectionsStore } from '@/stores/api/connectionsStore'
  import { useUserFeedStore } from '@/stores/api/UserFeedStore'
  import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'
  import { useMixtapeStore } from '@/stores/api/MixtapeStore'
  import { useFolderStore } from '@/stores/api/FolderStore'
  import { GlobalStore } from '@/stores/GlobalStore'
  import OverlayBox from '@/components/atoms/modules/OverlayBox.vue'
  import NavTreeModule from '@/components/atoms/modules/NavTreeModule.vue'

  onMounted(() => window.addEventListener('keyup', esc))
  onUnmounted(() => window.removeEventListener('keyup', esc))
  const store = GlobalStore()
  const connectionsStore = useConnectionsStore()
  const userFeedStore = useUserFeedStore()
  const mixtapeStore = useMixtapeStore()
  const index = mixtapeStore.mixtapes.findIndex(x => x.id === store.mixtape)
  const sindex = useSrcUrlSubsetStore().srcUrlSubsets.findIndex(x => x.id === store.srcUrlSubset)
  const overlay_edit = inject('overlay_edit')

  // TREE LOGIC
  function getMixFolderAssignments(nodes: Node[]): Node[] {
    return nodes
      .filter(parent =>
        parent.text !== 'mixtapes' &&
        parent.children?.some(child => child.id === mixtapeStore.mixtapes[index].id)
      )
      .map(parent => ({
        ...parent,
        children: []
      }))
  }

  function getNonAssignedFolders(nodes: Node[]): Node[] {
    return nodes
      .filter(parent =>
        parent.text !== 'mixtapes' &&
        !(parent.children?.some(child => child.id === mixtapeStore.mixtapes[index].id))
      )
      .map(parent => ({
        ...parent,
        children: []
      }))
  }

  function onNodeClick(node: any) {
      useFolderStore().patchFolder(node.folder_id, mixtapeStore.mixtapes[index].id)
  }

  // EDIT BOX LOGIC
  let title = ref()
  if (store.mixtape != '') {
    title = ref(mixtapeStore.mixtapes[index].name)
  } else {
    title.value = useSrcUrlSubsetStore().srcUrlSubsets[sindex].name
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

  const esc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close()
    }
  }
  function close() {
    overlay_edit.value = false
  }

  function escHandler(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close()
    }
  }

  onMounted(() => {
    window.addEventListener('keyup', escHandler, true)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keyup', escHandler, true)
  })
</script>
