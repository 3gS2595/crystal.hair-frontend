<template>
  <div v-if='isLoggedIn'>
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
        <th class='table-row'>[{{ this.getUserID }}]</th>
        <td class='table-row table-row-username'>{{ this.getUserEmail }}</td>
        <td class='table-row'>{{ this.getAuthToken }}</td>
      </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    <form @submit='onLogin' class='login-form'>
      <input class='login-form-email' type='text' v-model='loginEmail' placeholder='username' />
      <br />
      <input class='login-form-password' type='password' v-model='loginPassword' placeholder='password' />
      <br />
      <input type='submit' value='login' class='login-form-submit' />
    </form>
  </div>
</template>

<script>
import '@/store/index.ts'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'SessionManager',
  computed: {
  ...mapGetters(['getAuthToken', 'getUserEmail', 'getUserID', 'isLoggedIn'])
  },
  data () {
  return {
    signUpEmail: '',
    signUpPassword: '',
    loginEmail: '',
    loginPassword: ''
  }
  },
  methods: {
  ...mapActions(['registerUser', 'loginUser', 'logoutUser']),
  onSignUp (event) {
    event.preventDefault()
    const data = {
    user: {
      email: this.signUpEmail,
      password: this.signUpPassword
    }
    }
    this.registerUser(data)
    this.resetData()
  },
  onLogin (event) {
    event.preventDefault()
    const data = {
    user: {
      email: this.loginEmail,
      password: this.loginPassword
    }
    }
    this.loginUser(data)
    this.resetData()
  },
  resetData () {
    this.signUpEmail = ''
    this.signUpPassword = ''
    this.loginEmail = ''
    this.loginPassword = ''
  }
  }
}

</script>
