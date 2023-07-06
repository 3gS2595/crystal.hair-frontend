<template>
  <div id="app" class="theme-darl">
  <nav>
    <router-link to='/'>rss</router-link>
    <a>-</a>
    <router-link to='/about'>annex</router-link>
    <a>-</a>
    <button @click="darkToggle" >Toggle theme</button>
  </nav>
  <router-view/>
  </div>
</template>

<script setup>
const isDarkMode = false
const themeClasses = ['theme-light', 'theme-dark']

function darkToggle (e) {
  const app = document.getElementById('app')
  const isDarkMode = app.classList.contains('theme-dark')
  app.classList.remove(...themeClasses)
  if (isDarkMode) {
    app.classList.add('theme-light')
  } else {
    app.classList.add('theme-dark')
    // console.log('dark')
  }
}
</script>

<style lang='scss'>
  @import './style/table.scss';
  @import './style/canvas.scss';
  @import './style/main.scss';
</style>
<style lang='css'>
</style>
