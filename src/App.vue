<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
</template>

<style lang="scss" scoped>
  @import "./style/main.scss"; //Here i add extra "./"(current directory)
</style>
