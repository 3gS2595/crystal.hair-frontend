<template>
  <div v-if="sessionStore.isLoggedIn">
    <router-view />
  </div>
  <div v-else class="main" id="main">
    <SignIn />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { darkSet } from '@/lib/DarkMode'

  import SignIn from '@/components/atoms/SignIn.vue'
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
  @use '@/styles/Main';
  @use '@/styles/Typography';
  @use '@/styles/WebKit';

  @use '@/styles/components/Canvas';
  @use '@/styles/components/SignIn';
  @use '@/styles/components/ContentView';
  @use '@/styles/components/MixtapeView';
  @use '@/styles/components/ScrapersView';
  @use '@/styles/components/LightBox';
  @use '@/styles/components/Tabs';

  @use '@/styles/helpers/SplitterPanel';
  @use '@/styles/helpers/ProgressBar';
  @use '@/styles/helpers/NavSearch';
  @use '@/styles/helpers/Settings';
  @use '@/styles/helpers/AddMixtape';
  @use '@/styles/helpers/UploadBox';
  @use '@/styles/helpers/EditView';
  @use '@/styles/helpers/Search';
  @use '@/styles/helpers/Dropdown';

  @import 'overlayscrollbars/overlayscrollbars.css';
  @import 'splitpanes/dist/splitpanes.css';
</style>
