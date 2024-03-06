import { GlobalStore } from '@/stores/GlobalStore'

function darkSet () {
  const app = document.getElementById("app")
  if (app) {
    app.classList.remove(...['theme-light', 'theme-dark'])
    if (localStorage.getItem('darkModeBool') === 'false' ||
      (localStorage.getItem('darkModeBool') === 'false' && window.matchMedia('(prefers-color-scheme: light)').matches)
      ) {
      app.classList.add('theme-light')
      GlobalStore().darkMode = false
      document.getElementsByTagName('html')[0].style.backgroundColor = 'rgb(230, 230, 230)'
    } else {
      app.classList.add('theme-dark')
      GlobalStore().darkMode = true
      document.getElementsByTagName('html')[0].style.backgroundColor = '#101010'
    }
  }
}

function darkToggle () {
  if (localStorage.getItem('darkModeBool') === 'true') {
    localStorage.setItem('darkModeBool', 'false')
    GlobalStore().darkMode = false
  } else {
    localStorage.setItem('darkModeBool', 'true')
    GlobalStore().darkMode = true
  }
  console.log(GlobalStore().darkMode)
  darkSet()
}

export { darkToggle, darkSet }
