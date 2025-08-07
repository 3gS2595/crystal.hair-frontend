<template>
  <div v-if="sessionStore.isLoggedIn">
    <router-view />
  </div>
  <div class="main" id="main" v-else>
    <SessionManager />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { darkSet } from '@/lib/DarkMode'

  import SessionManager from '@/components/templates/SessionManager.vue'
  import { SessionStore } from '@/stores/SessionStore'

  const sessionStore = SessionStore()
  darkSet()
  onMounted(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener(
      'change',
      function (e: MediaQueryListEvent) {
        if (e.matches) {
          localStorage.setItem('darkModeBool', 'true')
        } else {
          localStorage.setItem('darkModeBool', 'false')
        }
        darkSet()
      }.bind(this),
      false
    )
  })
</script>

<style lang="scss">
  @use '@/scss/Main';
  @use '@/scss/Typography';
  @use '@/scss/WebKit';

  @use '@/scss/components/Canvas';
  @use '@/scss/components/SessionManager';
  @use '@/scss/components/ContentView';
  @use '@/scss/components/MixtapeView';
  @use '@/scss/components/ScrapersView';
  @use '@/scss/components/LightBox';
  @use '@/scss/components/Tabs';

  @use '@/scss/helpers/SplitterPanel';
  @use '@/scss/helpers/ProgressBar';
  @use '@/scss/helpers/NavSearch';
  @use '@/scss/helpers/Settings';
  @use '@/scss/helpers/AddMixtape';
  @use '@/scss/helpers/UploadBox';
  @use '@/scss/helpers/EditView';
  @use '@/scss/helpers/Search';
  @use '@/scss/helpers/Dropdown';

  @import 'overlayscrollbars/overlayscrollbars.css';
  @import 'splitpanes/dist/splitpanes.css';
</style>
