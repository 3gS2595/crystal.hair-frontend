<template>
  <!--
  <DropdownButton class="tab tab-width-standard tab-btn">
    <DropdownContent>
      <DropdownItem @click="store.tags = '00a6701a-2459-4b35-a9aa-4a5465b91045'">iconography</DropdownItem>
      <DropdownItem @click="store.tags = '0e2899ff-8341-4b3a-8ca8-a2d39e5798a0'">iconography_99</DropdownItem>
      <DropdownItem @click="store.tags = 'cfd2eabe-6573-4c2a-ae07-5d5ba35bda93'">iconography_90</DropdownItem>
      <DropdownItem @click="store.tags = '8bd49265-0798-442a-ba83-3ac5cabf6d38'">non_iconography</DropdownItem>
    </DropdownContent>
  </DropdownButton>
  -->
</template>

<script setup lang="ts">
import { GlobalStore } from '@/stores/GlobalStore'
import DropdownButton from "@/components/menus/dropdown/DropDownButton.vue"
import DropdownContent from "@/components/menus/dropdown/DropDownContent.vue"
import DropdownItem from "@/components/menus/dropdown/DropDownItem.vue"

// Pinia store
const store = GlobalStore()
</script>

