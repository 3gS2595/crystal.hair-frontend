<template>
  <div id="app" >
    <div v-if='isLoggedIn'>
      <nav>
        <router-link to='/'>rss</router-link>
        <a>-</a>
        <router-link to='/annex'>annex</router-link>
        <a>-</a>
        <a
          style="border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;"
          @click="darkToggle"
        >theme</a>
        <a>-</a>
        <LogOutBtn/>
      </nav>
      <router-view/>
    </div>

    <div v-else>
      <SessionManager/>
    </div>
  </div>
</template>

<script >
import LogOutBtn from '@/component/sessionManager/LogOutBtn'
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import '@/store/index.ts'
import SessionManager from '@/component/sessionManager/SessionManager.vue'
const themeClasses = ['theme-light', 'theme-dark']
const app = document.getElementById('app')

// preFetch
if (localStorage.getItem('darkModeBool') === 'true') {
  app.classList.add('theme-dark')
} else {
  app.classList.add('theme-light')
}
export default defineComponent({
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  name: 'App',
  components: {
    LogOutBtn,
    SessionManager
  },
  methods: {
    darkToggle (event) {
      app.classList.remove(...themeClasses)
      if (localStorage.getItem('darkModeBool') === 'true') {
        app.classList.add('theme-light')
        localStorage.setItem('darkModeBool', 'false')
      } else {
        app.classList.add('theme-dark')
        localStorage.setItem('darkModeBool', 'true')
      }
    }
  }
})
</script>

<style lang='scss'>
  @import './style/Table.scss';
  @import './style/Canvas.scss';
  @import './style/SessionManager.scss';
  @import './style/Main.scss';
  @import './style/Content.scss';
  @import './style/SplitterPanel.scss';
</style>
