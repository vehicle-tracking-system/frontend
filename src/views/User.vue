<template lang="pug">
  v-container
    v-card
      v-card-title(class="mt-8") {{ user.name }}
      v-card-subtitle {{ user.username }}
      v-card-text
        v-row
          v-col
            v-card
              v-card-title Roles
              v-card-text
                v-chip(v-for="(role, _) in this.user.roles" :key="role" class="ma-2") {{ role }}
          v-col
            v-card
              v-card-title Change password
              v-card-text
                v-form(
                  ref="form"
                  v-model="valid"
                  @keyup.native.enter="save"
                  lazy-validation)
                  v-row
                    //v-col(cols='12' sm='6' md='6')
                    //  v-text-field(v-model='user.name'
                    //    :rules="[rules.required]"
                    //    label='Name')
                    //v-col(cols='12' sm='6' md='6')
                    //  v-text-field(v-model='user.username'
                    //    :rules="[rules.required]"
                    //    label='Username')
                    v-col(offset='3' cols='12' sm='6' md='6' center)
                      v-text-field(v-model='password'
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPass ? 'text' : 'password'"
                        :rules="[rules.required, rules.min]"
                        label='Password'
                        @click:append="showPass = !showPass")
                      v-text-field(v-model='passwordagain'
                        :append-icon="showPassAgain ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPassAgain ? 'text' : 'password'"
                        :rules="[rules.required, rules.match]"
                        label='Password again'
                        @click:append="showPassAgain = !showPassAgain")

              v-card-actions(class="justify-center")
                v-btn(type="submit" @click="save") Save
</template>

<script>
import axios from 'axios'
import * as api from '@/api/user'

export default {
  name: 'User',
  data () {
    return {
      showPass: false,
      showPassAgain: false,
      user: null,
      rules: {
        required: value => !!value || 'Required.',
        min: v => (v && v.length >= 8) || 'Min 8 characters',
        match: v => (v === this.password) || 'Passwords didn\'t match'
      },
      valid: false,
      password: '',
      passwordagain: ''
    }
  },
  created: function () {
    this.user = this.userDetails()
  },
  methods: {
    async userDetails () {
      console.log(this.$store.getters.StateUser)
      await (await axios.get('/auth').then(response => {
        console.log(response.data)
        this.user = response.data
      }))
    },
    save () {
      if (this.validate()) {
        api.changeYoursPassword(this.password).then(_ => {
          this.$snotify.success('Your password has been successfully changed.')
        }).catch(e => this.$snotify.error(e.message))
      } else {
        this.$snotify.error('Passwords are not filled correctly!')
      }
      this.password = ''
      this.passwordagain = ''
    },
    validate () {
      return this.$refs.form.validate()
    }

  }
}
</script>

<style scoped>

</style>
