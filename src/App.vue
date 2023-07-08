<template>
  <div id="app" >
  <nav>
    <router-link to='/'>rss</router-link>
    <a>-</a>
    <router-link to='/about'>annex</router-link>
    <a>-</a>
    <button style="border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;" @click="darkToggle" >theme</button>
  </nav>
  <router-view/>
  </div>
</template>

<script setup>
const themeClasses = ['theme-light', 'theme-dark']
const app = document.getElementById('app')

// preFetch
if (localStorage.getItem('darkModeBool') === 'true') {
  app.classList.add('theme-dark')
} else {
  app.classList.add('theme-light')
}
// window.open('render.html', '_blank', 'toolbar=0,location=0,menubar=0')
// onClick
function darkToggle (e) {
  app.classList.remove(...themeClasses)
  if (localStorage.getItem('darkModeBool') === 'true') {
    app.classList.add('theme-light')
    localStorage.setItem('darkModeBool', 'false')
  } else {
    app.classList.add('theme-dark')
    localStorage.setItem('darkModeBool', 'true')
  }
}
</script>

<style lang='scss'>
  @import './style/table.scss';
  @import './style/canvas.scss';
  @import './style/main.scss';
  @import './style/Content.scss';
  @import './style/SplitterPanel.scss';
</style>
