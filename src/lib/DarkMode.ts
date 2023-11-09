import { GlobalStore } from '@/store/GlobalStore'

function darkSet () {
  const store = GlobalStore()
  const app = document.getElementById("app")
  if (app) {
    app.classList.remove(...['theme-light', 'theme-dark'])
    if (localStorage.getItem('darkModeBool') === 'false' ||
      (localStorage.getItem('darkModeBool') === 'false' && window.matchMedia('(prefers-color-scheme: light)').matches)
      ) {
      app.classList.add('theme-light')
      store.setDarkMode(false)
      document.getElementsByTagName('html')[0].style.backgroundColor = 'rgb(230, 230, 230)'
    } else {
      app.classList.add('theme-dark')
      store.setDarkMode(true)
      document.getElementsByTagName('html')[0].style.backgroundColor = '#101010'
    }
  }
}

function darkToggle () {
  const store = GlobalStore()
  if (localStorage.getItem('darkModeBool') === 'true') {
    localStorage.setItem('darkModeBool', 'false')
    store.setDarkMode(false)
  } else {
    localStorage.setItem('darkModeBool', 'true')
    store.setDarkMode(true)
  }
  console.log(store.darkMode)
  darkSet()
}

export { darkToggle, darkSet }
