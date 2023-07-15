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
     <span>Loading...</span>
   </template>

 </Suspense>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import HomeView from './HomeView.vue'
import SessionManager from '../component/sessionManager/SessionManager.vue'
import '@/store/index.ts'
import { mapActions, mapGetters } from 'vuex'
import { ApiStore } from '../store/ApiStore'
export default defineComponent({
  computed: {
    ...mapGetters(['getAuthToken', 'getUserEmail', 'getUserID', 'isLoggedIn'])
  },
  name: 'IndexView',
  components: {
    SessionManager,
    HomeView
  },
  methods: {
    ...mapActions(['registerUser', 'loginUser', 'logoutUser']),
    forceRerender () {
      this.componentKey += 1
    }
  }
})

</script >
