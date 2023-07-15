<template>
  <a @click='logoutUser' class='logout-button'>logout</a>
 </template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'

import '@/store/index.ts'
console.log('awkjhfae')
export default defineComponent({
  name: 'LogOutBtn',
  methods: {
    ...mapActions(['logoutUser'])
  }
})

</script >
