<template>
  <Search />
  <OverlayScrollbarsComponent defer>
    <Draggable ref="tree" id="tree" class="mtl-tree" v-model="treeData" :indent="15" treeLine>
      <template #default="{ node, stat }">
        <div :class="{ 'has-children': stat.children.length }" style="width: 100%">
          <OpenIcon
            v-if="stat.children.length"
            :open="stat.open"
            class="mtl-mr"
            @click="stat.open = !stat.open"
          />
          <div @click="handleClick(node)" class="dgb-nav">
            <div class="dgb-title">
              <a class="title font-s-title text-main-0">{{ node.text }}</a>
              <img
                v-if="feedCheck(node.id)"
                class="mix-feed-icon"
                src="https://crystal-hair.nyc3.digitaloceanspaces.com/feed.png"
              />
            </div>
            <div v-if="showDetails(stat, node)">
              <a class="descr descr-r font-s-descr text-main-0">
                {{ convertDate(getDateValue(node)) }}
              </a>
              <a class="descr descr-l font-s-descr text text-main-0">
                {{ convertCount(getBlockCount(node)) }}
              </a>
            </div>
          </div>
        </div>
      </template>
    </Draggable>
  </OverlayScrollbarsComponent>
</template>

<script setup lang="ts">
  import { toRefs } from 'vue'
  import { Draggable, OpenIcon } from '@he-tree/vue'
  import '@he-tree/vue/style/default.css'
  import '@he-tree/vue/style/material-design.css'
  import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

  import Search from '@/components/atoms/Search.vue'

  // Props
  interface Props {
    treeData: any
    feedCheck: (id: string) => boolean
    getBlockCount: (node: any) => number | null
    getDateValue: (node: any) => any
    showDetails: (stat: any, node: any) => boolean
    onNodeClick: (node: any) => void
  }

  const props = defineProps<Props>()
  const { treeData, feedCheck, getBlockCount, getDateValue, showDetails, onNodeClick } = toRefs(props)

  // Utility methods
  const convertCount = (count: number | null): string => {
    return count != null ? `{${count}}` : ' '
  }

  const convertDate = (dateVal: any): string => {
    if (!dateVal) return ''
    const datetime = new Date(dateVal)
    const now = new Date()
    const days = Math.floor((now.getTime() - datetime.getTime()) / (1000 * 60 * 60 * 24))
    const hours = Math.floor((now.getTime() - datetime.getTime()) / (1000 * 60 * 60) - days * 24)
    const minutes = Math.floor(
      (now.getTime() - datetime.getTime()) / (1000 * 60) - hours * 60 - days * 24 * 60
    )
    return `{${days.toString().padStart(2, '0')}: ${hours.toString().padStart(2, '0')}: ${minutes
      .toString()
      .padStart(2, '0')}}`
  }

  function handleClick(node: any) {
    onNodeClick.value(node)
  }
</script>
