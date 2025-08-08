<template>
  <div id='login'>
    <div class='login-ui'>
      <form @submit.prevent='onLogin' class='login-form'>
        <input class='login-form-email' type='text' v-model='loginEmail' placeholder='' autocapitalize="off" />
        <br />
        <input class='login-form-password' type='password' v-model='loginPassword' placeholder='' />
        <button type="submit" class="login-form-submit">
          <img src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/page-loader.gif" alt="Login" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { SessionStore } from '@/stores/SessionStore'

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
