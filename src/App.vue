<template>
  <div class='main' id='main' v-if='isLoggedIn'>
    <nav id='nav'>
      <router-link  class='navItem' to='/'>index</router-link>
      <router-link  class='navItem' to='/annex'>annex</router-link>
      <a  class='navItem' 
        @click="darkToggle"
        >theme</a>
      <a  class='navItem' 
        @click="logout"
        >logout</a>
      <DropDown/>
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
import DropDown from '@/component/dropDown/DropDown';

export default defineComponent({
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  name: 'App',
  components: {
    SessionManager,
    DropDown
  },
  methods: {
    darkSet () {
      app.classList.remove(...['theme-light', 'theme-dark'])
      if (localStorage.getItem('darkModeBool') === 'true') {
        app.classList.add('theme-light')
      } else {
        app.classList.add('theme-dark')
      }
    },
    darkToggle () {
      if (localStorage.getItem('darkModeBool') === 'true') localStorage.setItem('darkModeBool', 'false')
      else localStorage.setItem('darkModeBool', 'true')
      this.darkSet()
    },
    logout () {
      localStorage.clear()
      sessionStorage.clear()
      location.reload()
    },
    
    // handles ios safari landscape notch
    orientationChange: function () {
      const conM = document.getElementById('contentMain')
      const nav = document.getElementById('nav')
      const orientation = window.orientation
      const topP = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat').substring(0, 2))
      const sidP = 38
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        if (orientation === 0) {
          app.style.paddingTop = topP + 'px'
          app.style.paddingRight = 0
          app.style.paddingLeft = 0
          conM.style.width = String(window.innerWidth - 4) + 'px'
          nav.style.width = String(window.innerWidth - 4) + 'px'
          conM.style.borderBottomLeftRadius = '34.0pt'
          conM.style.borderBottomRightRadius = '34.0pt'
        } else if (orientation === 90) {
          app.style.paddingTop = 0
          app.style.marginRight = 0
          app.style.paddingLeft = sidP + 'px'
          conM.style.width = String(window.innerWidth - sidP - 4) + 'px'
          nav.style.width = String(window.innerWidth - sidP - 4) + 'px'
          conM.style.borderBottomLeftRadius = '0pt'
          conM.style.borderBottomRightRadius = '34.0pt'
        } else if (orientation === -90) {
          app.style.paddingTop = 0
          app.style.paddingRight = sidP + 'px'
          app.style.paddingLeft = 0
          conM.style.width = String(window.innerWidth - sidP - 4) + 'px'
          nav.style.width = String(window.innerWidth - sidP - 4) + 'px'
          conM.style.borderBottomLeftRadius = '34.0pt'
          conM.style.borderBottomRightRadius = '0pt'
        } else {
          app.style.paddingTop = 0
          app.style.paddingRight = 0
          app.style.paddingLeft = 0
          conM.style.width = String(window.innerWidth - 4) + 'px'
          nav.style.width = String(window.innerWidth - 4) + 'px'
          conM.style.borderBottomLeftRadius = '34.0pt'
          conM.style.borderBottomRightRadius = '34.0pt'
        }
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.orientationChange)
    window.addEventListener('orientationchange', this.orientationChange)
    this.darkSet()
  }
})
</script>

<style lang='scss'>
  @import 'splitpanes/dist/splitpanes.css';
  @import 'primeflex/primeflex.css';

  @import './style/Table.scss';
  @import './style/Canvas.scss';
  @import './style/SessionManager.scss';
  @import './style/Main.scss';
  @import './style/Content.scss';
  @import './style/SplitterPanel.scss';
  @import './style/Font.scss';
  @import './style/WebKit.scss';
  @import './style/LightBox.scss';
</style>
