<template>
  <div v-if='isLoggedIn'>
    <nav id='nav'>
      <router-link class='navItem' to='/'>index</router-link>
      <a class='navItem' @click="darkToggle">theme</a>
      <a class='navItem' @click="logout">logout</a>
      <DropDown/>
      <a class='navItem' @click="reset">X</a>
      <input class='search' v-model="q" placeholder="search" @keyup.enter="search(q)" />
    </nav>
    <router-view/>
  </div>

  <div class='main' id='main' v-else>
    <SessionManager/>
  </div>
</template>

<script lang='ts'>
import { defineComponent, watch } from 'vue'
import { mapGetters } from 'vuex'
import '@/store/index'
import { filterStore } from '@/store/FilterStore'
import SessionManager from '@/component/sessionManager/SessionManager.vue'
import DropDown from '@/component/dropDown/DropDown.vue'

import ContentModule from '@/component/content/ContentModule.vue'
export default defineComponent({
  name: 'app',
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  components: {
    SessionManager,
    DropDown
  },
  data () {
    return {
      q: '',
    }
  },
  mounted () {
    this.orientationChange()
    this.darkSet()
    const self = this
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e: MediaQueryListEvent) {
      if (e.matches) {
        localStorage.setItem('darkModeBool', 'true')
      } else {
        localStorage.setItem('darkModeBool', 'false')
      }
      self.darkSet()
    }.bind(self), false)
    window.addEventListener('resize', this.orientationChange)
    window.addEventListener('orientationchange', this.orientationChange)
  },
  methods: {
    darkSet () {
      const app = document.getElementById("app")
      if (app) {
        app.classList.remove(...['theme-light', 'theme-dark'])
        if (localStorage.getItem('darkModeBool') === 'false' || 
          (localStorage.getItem('darkModeBool') === 'false' && window.matchMedia('(prefers-color-scheme: light)').matches)
          ) { 
          app.classList.add('theme-light')
          document.getElementsByTagName('html')[0].style.backgroundColor = 'white'
        } else {
          app.classList.add('theme-dark')
          document.getElementsByTagName('html')[0].style.backgroundColor = 'black'
        }
      }
    },
    darkToggle () {
      if (localStorage.getItem('darkModeBool') === 'true') {
        localStorage.setItem('darkModeBool', 'false')
      } else {
        localStorage.setItem('darkModeBool', 'true')
      }
      this.darkSet()
    },
    logout () {
      localStorage.removeItem('auth_token')
      location.reload()
    },
    search: function (e: string) {
      const store = filterStore()
      store.setFilter(e)
    },
    reset: function () {
      const store = filterStore()
      store.setFilter('')
      store.setMixtape('')
      store.setSortBy('time_posted desc')
    },
    orientationChange: function () {
      const app = document.getElementById("app")
      if (app && navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        app.classList.remove(...['ios1', 'ios2', 'ios3', 'ios4'])
        if (window.orientation === 90) {
          app.classList.add('ios1')
        } else if (window.orientation === -90) {
          app.classList.add('ios2')
        } else if ('standalone' in window.navigator) {
          app.classList.add('ios3')
        } else {
          app.classList.add('ios4')
        }
      }
    }
  }
 })
</script>

<style lang='scss'>
  @import './style/Main.scss';
  @import './style/Canvas.scss';
  @import './style/SessionManager.scss';
  @import './style/Content.scss';
  @import './style/SplitterPanel.scss';
  @import './style/Font.scss';
  @import './style/WebKit.scss';
  @import './style/LightBox.scss';

  @import 'splitpanes/dist/splitpanes.css';
  @import 'primeflex/primeflex.css';
</style>
