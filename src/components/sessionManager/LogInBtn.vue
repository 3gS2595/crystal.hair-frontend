<template>
  <button class="button__login" @click="handleLogin">Log In</button>
</template>

<script>
export default {
  methods: {
    handleLogin() {
      this.$auth0.loginWithRedirect({
        appState: {
          targetPath: "/profile",
        },
        authorizationParams: {
          prompt: "login",
        },
      });
    },
  },
};
</script>
