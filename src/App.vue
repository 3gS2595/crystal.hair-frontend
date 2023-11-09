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
import { GlobalStore } from '@/store/GlobalStore'

//import { orientationChange } from '@/lib/IosOrientation'
import { darkSet } from '@/ts/DarkMode'

import SessionManager from '@/components/sessionManager/SessionManager.vue'
import { SessionStore } from "@/store/SessionStore"
import 'vue-slider-component/theme/default.css'

const sessionStore = SessionStore()

onMounted(() => {
  //orientationChange()
  darkSet()
  const self = this
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e: MediaQueryListEvent) {
    if (e.matches) {
      localStorage.setItem('darkModeBool', 'true')
    } else {
      localStorage.setItem('darkModeBool', 'false')
    }
    darkSet()
  }.bind(self), false)
  //window.addEventListener('resize', orientationChange)
  //window.addEventListener('orientationchange', orientationChange)
})
</script>

<style lang='scss'>
  @import './scss/Main.scss';
  @import './scss/Typography.scss';
  @import './scss/WebKit.scss';

  @import './scss/components/Canvas.scss';
  @import './scss/components/SessionManager.scss';
  @import './scss/components/ContentView.scss';
  @import './scss/components/DataView.scss';
  @import './scss/components/MixtapeView.scss';
  @import './scss/components/LightBox.scss';
  @import './scss/components/SplitterPanel.scss';

  @import 'splitpanes/dist/splitpanes.css';
</style>
