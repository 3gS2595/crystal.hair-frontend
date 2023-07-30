<template>
  <div class='main' id='main' v-if='isLoggedIn'>
    <nav>
      <router-link to='/'>rss</router-link>

      <a>-</a>

      <router-link to='/annex'>annex</router-link>

      <a>-</a>

      <router-link to='/input'>input</router-link>

      <a>-</a>

      <a
        style="border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;"
        @click="darkToggle">
        theme
      </a>

      <a>-</a>

      <LogOutBtn/>

      <a>-</a>

      <a
        style="border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;"
        @click="windowPop">
        wind
      </a>

      <a>-</a>

      <a
        style="border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;"
        @click="cookies">
        cookies
      </a>

    </nav>
    <router-view/>
  </div>

  <div class='main' id='main' v-else>
    <SessionManager/>
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
if (window.navigator.standalone) {
  const mainc = document.getElementById('app')
  mainc.classList.add('standalone')
} else {
  const mainc = document.getElementById('app')
  mainc.classList.add('stane')
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
    windowPop () {
      window.open('http://3.130.240.169', '_blank', 'toolbar=0,location=0,menubar=0')
    },
    cookies () {
      const themeTemp = localStorage.getItem('darkModeBool')
      localStorage.clear()
      sessionStorage.clear()
      localStorage.setItem('darkModeBool', themeTemp)
      location.reload()
    },

    darkToggle () {
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

window.onorientationchange = function () {
  const orientation = window.orientation
  const topP = getComputedStyle(document.documentElement).getPropertyValue('--sat')
  const sidP = getComputedStyle(document.documentElement).getPropertyValue('--sar')
  if (orientation === 0) {
    app.style.paddingTop = topP
    app.style.paddingRight = 0
    app.style.paddingLeft = 0
    app.style.minWidth = String(window.innerWidth) + "px"
  }
  if (orientation === 90) {
    app.style.paddingTop = 0
    app.style.paddingRight = 0
    app.style.paddingLeft = sidP
    app.style.width = String((window.innerWidth - parseInt(sidP.substring(0,2)))) + "px"
  }

  if (orientation === -90) {
    app.style.paddingTop = 0
    app.style.paddingRight = sidP
    app.style.paddingLeft = 0
    app.style.width = String((window.innerWidth - parseInt(sidP.substring(0,2)))) + "px"
  }
}
</script>

<style lang='scss'>
  @import './style/Table.scss';
  @import './style/Canvas.scss';
  @import './style/SessionManager.scss';
  @import './style/Main.scss';
  @import './style/Content.scss';
  @import './style/SplitterPanel.scss';
  @import './style/Font.scss';
  @import './style/WebKit.scss';

  @import 'splitpanes/dist/splitpanes.css';
  @import 'primeflex/primeflex.css';
</style>
