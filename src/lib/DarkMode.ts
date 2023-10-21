function darkSet () {
  const app = document.getElementById("app")
  if (app) {
    app.classList.remove(...['theme-light', 'theme-dark'])
    if (localStorage.getItem('darkModeBool') === 'false' ||
      (localStorage.getItem('darkModeBool') === 'false' && window.matchMedia('(prefers-color-scheme: light)').matches)
      ) {
      app.classList.add('theme-light')
      document.getElementsByTagName('html')[0].style.backgroundColor = 'rgb(230, 230, 230)'
    } else {
      app.classList.add('theme-dark')
      document.getElementsByTagName('html')[0].style.backgroundColor = ' black'
    }
  }
}

function darkToggle () {
  if (localStorage.getItem('darkModeBool') === 'true') {
    localStorage.setItem('darkModeBool', 'false')
  } else {
    localStorage.setItem('darkModeBool', 'true')
  }
  darkSet()
}

export { darkToggle, darkSet }
