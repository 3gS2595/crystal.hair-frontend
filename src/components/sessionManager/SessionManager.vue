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
  <div v-else>
    <form @submit.prevent='onLogin' class='login-form'>
      <a>user:  </a>
      <input class='login-form-email' type='text' v-model='loginEmail' placeholder='username' autocapitalize="off" />
      <br />
      <a>pass: </a>
      <input class='login-form-password' type='password' v-model='loginPassword' placeholder='password' />
      <br />
      <input type='submit' value='request' class='login-form-submit' />
    </form>
  </div>
</template>

<script setup lang='ts'>
import { SessionStore } from '@/store/SessionStore'
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
