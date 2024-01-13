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
import { SessionStore } from "@/services/SessionStore"

const sessionStore = SessionStore()

onMounted(() => {
  darkSet()
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
  @import './assets/scss/Main.scss';
  @import './assets/scss/Typography.scss';
  @import './assets/scss/WebKit.scss';

  @import './assets/scss/components/Canvas.scss';
  @import './assets/scss/components/SessionManager.scss';
  @import './assets/scss/components/ContentView.scss';
  @import './assets/scss/components/MixtapeView.scss';
  @import './assets/scss/components/ScrapersView.scss';
  @import './assets/scss/components/LightBox.scss';
  @import './assets/scss/components/Tabs.scss';

  @import './assets/scss/helpers/SplitterPanel.scss';
  @import './assets/scss/helpers/ProgressBar.scss';
  @import './assets/scss/helpers/NavSearch.scss';
  @import './assets/scss/helpers/Settings.scss';
  @import './assets/scss/helpers/AddMixtape.scss';
  @import './assets/scss/helpers/UploadBox.scss';

  @import 'splitpanes/dist/splitpanes.css';
</style>
