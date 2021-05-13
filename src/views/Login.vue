<template lang="pug">
  div
    v-container(fluid)
      v-layout(align-center justify-center)
        v-flex(class='login-form text-center' @submit.prevent="submit")
          .display-1.mb-3 #[v-icon.mr-2(large) mdi-car] Vehicle tracking system
          v-card(light)
            v-card-text
              .subheading
                template(v-if='!isLoggedIn') Log in to your account
                template(v-else) You are already logged in
              v-form(v-if='!isLoggedIn')
                v-text-field(v-if='!isLoggedIn' v-model='form.username' light prepend-icon='mdi-account' label='Username')
                v-text-field(v-model='form.password' light prepend-icon='mdi-lock' label='Password' type='password')
                v-btn(v-if='!isLoggedIn' block type='submit') Sign in
              div(v-if='isLoggedIn')
                v-btn(light block @click='logout') Logout
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  components: {},
  data () {
    return {
      form: {
        username: null,
        password: null
      },
      showError: false
    }
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    ...mapActions(['LogIn', 'LogOut']),
    async submit () {
      const User = {
        username: this.form.username,
        password: this.form.password
      }
      try {
        await this.LogIn(User)
        this.$snotify.success('Login was successful', { timeout: 3000 })
        await this.$router.push('/live')
        this.showError = false
      } catch (error) {
        console.log(error)
        switch (error.response.status) {
          case 404:
            this.$snotify.error('Server is currently down, try again later.', { timeout: 3000 })
            break
          case 403:
            this.$snotify.error('Username or Password is incorrect', { timeout: 3000 })
            break
          default:
            this.$snotify.error('Unexpected error occurred: ' + error, { timeout: 10000 })
        }
        this.showError = true
      }
    },
    async logout () {
      await this.LogOut()
      if (this.$route.name !== 'Login') {
        await this.$router.push('/login')
      }
    }
  }
}
</script>
<style lang="sass" scoped>
.login-form
  max-width: 500px

.center-span
  text-align: center
  margin-left: auto
  margin-right: auto
</style>
