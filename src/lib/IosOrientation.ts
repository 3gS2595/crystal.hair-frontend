function orientationChange () {
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
export { orientationChange } 
