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

import { orientationChange } from '@/component/indexHelpers/IosOrientation' 
import { darkToggle, darkSet } from '@/component/indexHelpers/DarkMode' 

import ContentModule from '@/component/content/ContentModule.vue'
import SessionManager from '@/component/sessionManager/SessionManager.vue'
import DropDown from '@/component/dropDown/DropDown.vue'

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
    window.addEventListener('resize', this.orientationChange)
    window.addEventListener('orientationchange', this.orientationChange)
  },
  methods: {
    orientationChange,
    darkToggle,
    darkSet,
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
</style>
