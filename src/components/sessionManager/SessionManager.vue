<template>
  <div v-if='sessionStore.isLoggedIn'>
    <table class='table'>
      <thead class='thead-dark'>
      <tr class='table-headers'>
        <th scope='col'>ID</th>
        <th scope='col'>name</th>
        <th scope='col'>Token</th>
      </tr>
      </thead>
      <tbody>
      <tr class='table-rows'>
        <th class='table-row'>[{{ sessionStore.getUserID }}]</th>
        <td class='table-row table-row-username'>{{ sessionStore.getUserEmail }}</td>
        <td class='table-row'>{{ sessionStore.getAuthToken }}</td>
      </tr>
      </tbody>
    </table>
  </div>

  <div v-else id='login'>
    <!-- <img class='login-overlay' src='https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/login-background.png'> -->
    <div class='login-ui'>

      <form @submit.prevent='onLogin' class='login-form'>
        <input class='login-form-email' type='text' v-model='loginEmail' placeholder='username' autocapitalize="off" />
        <br />
        <input class='login-form-password' type='password' v-model='loginPassword' placeholder='password' />
        <br />
        <input type='submit' value='Login' class='login-form-submit' />
      </form>

    </div>
  </div>
</template>

<script setup lang='ts'>
import { SessionStore } from '@/stores/SessionStore'
import { ref } from 'vue'

const sessionStore = SessionStore();
const loginEmail = ref('');
const loginPassword = ref('');

const onLogin = () => {
  let data = {
    user: {
      email: loginEmail.value,
      password: loginPassword.value,
    },
  };
  sessionStore.loginUser(data);
  resetData();
}

const resetData = () => {
  loginEmail.value = ''
  loginPassword.value = ''
}
</script>
