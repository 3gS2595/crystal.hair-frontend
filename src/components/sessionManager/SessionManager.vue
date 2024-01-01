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
    <form @submit.prevent='onLogin' class='login-form'>
      <a>How did you find this? Development Server At the Momenet! Apologies!</a>
      <br />
      <a>Usr:  </a>
      <input class='login-form-email' type='text' v-model='loginEmail' placeholder='username' autocapitalize="off" />
      <br />
      <a>Pwd: </a>
      <input class='login-form-password' type='password' v-model='loginPassword' placeholder='password' />
      <br />
      <input type='submit' value='Login' class='login-form-submit' />
    </form>
    <div class="splash">
      <div class="img5">
        <img src="https://instagram.fccj9-1.fna.fbcdn.net/v/t51.2885-15/408513103_380317981099470_3548982446640599191_n.jpg?stp=dst-jpg_e35_s360x360&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMDA4eDczMC5zZHIifQ&_nc_ht=instagram.fccj9-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=RIlDf3SL8aAAX9VBmlT&edm=ABmJApABAAAA&ccb=7-5&ig_cache_key=MzI1MjY2MzA0NjQ1ODM2NDEzNA%3D%3D.2-ccb7-5&oh=00_AfDKUmKV92CVWjRaIu4_0XWcQ8TwMzDZ5sNSTMSoFf0m5Q&oe=658D2F42&_nc_sid=b41fef">
      </div>
      <div class="img4">
        <img src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/sitedemo.gif">
      </div>

    </div>
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
const onDemo = () => {
  let data = {
    user: {
      email: 'public',
      password: 'public',
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
