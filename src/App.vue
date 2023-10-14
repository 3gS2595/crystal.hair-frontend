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
import { darkSet } from '@/lib/DarkMode' 

import SessionManager from '@/component/sessionManager/SessionManager.vue'
import { SessionStore } from "@/store/SessionStore";

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
  @import './style/Main.scss';
  @import './style/Canvas.scss';
  @import './style/SessionManager.scss';
  @import './style/ContentView.scss';
  @import './style/DataView.scss';
  @import './style/MixtapeView.scss';
  @import './style/SplitterPanel.scss';
  @import './style/Font.scss';
  @import './style/WebKit.scss';
  @import './style/LightBox.scss';
  @import 'splitpanes/dist/splitpanes.css';
</style>
