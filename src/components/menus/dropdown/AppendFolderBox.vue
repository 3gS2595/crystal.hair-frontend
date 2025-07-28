<template>
  <!--
  <DropdownButton
    v-if="store.mixtape !== '' && !(store.srcUrlSubset.length > 2 || store.srcUrlSubset === '-1')"
    class="tab tab-width-standard tab-btn"
  >
    <DropdownContent>
      <DropdownItem
        v-for="folder in folderStore.folders"
        :key="folder.id"
        @click="patch(folder.id)"
      >
        {{ folder.name }}
      </DropdownItem>
      <DropdownItem @click="store.addFolderBoxView = true">add new folder</DropdownItem>
    </DropdownContent>
  </DropdownButton>
    -->
</template>

<script lang="ts" setup>
import { GlobalStore } from '@/stores/GlobalStore'
import { useFolderStore } from '@/stores/api/FolderStore'

import DropdownButton from '@/components/menus/dropdown/DropDownButton.vue'
import DropdownContent from '@/components/menus/dropdown/DropDownContent.vue'
import DropdownItem from '@/components/menus/dropdown/DropDownItem.vue'

const store = GlobalStore()
const folderStore = useFolderStore()

function patch(folder_id: string) {
  folderStore.patchFolder(folder_id, store.mixtape)
}
</script>
