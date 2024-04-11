<template>
  <div v-if='sessionStore.isLoggedIn'>
    <router-view/>
  </div>
  <div class='main' id='main' v-else>
    <SessionManager/>
  </div>
</template>

<script setup lang='ts'>
import { defineComponent, onMounted, watch } from 'vue'
import { darkSet } from '@/lib/DarkMode'

import SessionManager from '@/components/sessionManager/SessionManager.vue'
import { SessionStore } from "@/stores/SessionStore"

const sessionStore = SessionStore()
darkSet()

onMounted(() => {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e: MediaQueryListEvent) {
    if (e.matches) {
      localStorage.setItem('darkModeBool', 'true')
    } else {
      localStorage.setItem('darkModeBool', 'false')
    }
    darkSet()
  }.bind(this), false)
})
</script>

<style lang='scss'>
  @import './scss/Main.scss';
  @import './scss/Typography.scss';
  @import './scss/WebKit.scss';

  @import './scss/components/Canvas.scss';
  @import './scss/components/SessionManager.scss';
  @import './scss/components/ContentView.scss';
  @import './scss/components/MixtapeView.scss';
  @import './scss/components/ScrapersView.scss';
  @import './scss/components/LightBox.scss';
  @import './scss/components/Tabs.scss';

  @import './scss/helpers/SplitterPanel.scss';
  @import './scss/helpers/ProgressBar.scss';
  @import './scss/helpers/NavSearch.scss';
  @import './scss/helpers/Settings.scss';
  @import './scss/helpers/AddMixtape.scss';
  @import './scss/helpers/UploadBox.scss';
  @import './scss/helpers/EditView.scss';
  @import './scss/helpers/Search.scss';
  @import './scss/helpers/Dropdown.scss';

  @import 'overlayscrollbars/overlayscrollbars.css';
  @import 'splitpanes/dist/splitpanes.css';
</style>
