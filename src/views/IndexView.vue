<template>
  <Suspense>

    <template #default>
      <div v-if='isLoggedIn'>
        <HomeView :key="componentKey"/>
      </div>
      <div v-else>
        <SessionManager/>
      </div>
    </template>

     <template #fallback>
       <span>Loading</span>
     </template>

  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import '@/store/index.ts'

import HomeView from '@/views/HomeView.vue'
import SessionManager from '@/component/sessionManager/SessionManager.vue'

export default defineComponent({
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  name: 'IndexView',
  components: {
    SessionManager,
    HomeView
  }
})

</script >
