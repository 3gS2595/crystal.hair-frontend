<template>
    <DropdownButton
      v-if="store.mixtape!='' && !(store.srcUrlSubset.length > 2 || store.srcUrlSubset == '=1')"
      class="tab tab-width-standard tab-btn">
      <DropdownContent>
        <DropdownItem @click='patch(folder.id)' v-for="folder in folderStore.folders">
          {{ folder.name }}
        </DropdownItem>
        <DropdownItem
          @click='this.store.addFolderBoxView = true'
        >add to folder</DropdownItem>
      </DropdownContent>
    </DropdownButton>
</template>

<script lang='ts'>

import {defineComponent } from 'vue'
import { GlobalStore } from '@/stores/GlobalStore'
import { useFolderStore } from '@/stores/api/FolderStore'
import DropdownButton from "@/components/menus/dropdown/DropDownButton.vue"
import DropdownContent from "@/components/menus/dropdown/DropDownContent.vue"
import DropdownItem from "@/components/menus/dropdown/DropDownItem.vue"

export default defineComponent({
  components: {
    DropdownButton,
    DropdownContent,
    DropdownItem
  },
  data () {
    return {
      folderStore: useFolderStore(),
      store: GlobalStore()
    }
  },
  methods: {
     patch(folder_id : string) {
      console.log("quarter")
      useFolderStore().patchFolder(folder_id, this.store.mixtape)
    }
  }
})
</script>
