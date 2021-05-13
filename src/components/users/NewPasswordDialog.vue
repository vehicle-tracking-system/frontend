<template lang="pug">
  v-dialog(v-model='dialog' max-width='500px' persistent)
    v-card
      v-card-title.headline Change password
      v-card-text
        v-form(
          ref="form"
          v-model="valid"
          lazy-validation)
          v-row
            v-col(offset='3' cols='12' sm='6' md='6' center)
              v-text-field(v-model='password'
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                :rules="[rules.required, rules.min]"
                label='Password'
                @click:append="showPass = !showPass")
      v-card-actions
        v-spacer
        v-btn(color='blue darken-1' text='' @click='close') Cancel
        v-btn(color='blue darken-1' text='' @click='save') OK
        v-spacer
</template>

<script>
export default {
  props: ['dialog'],
  name: 'NewPasswordDialog',
  data () {
    return {
      showPass: false,
      password: '',
      rules: {
        required: value => !!value || 'Required.',
        min: v => (v && v.length >= 8) || 'Min 8 characters'
      },
      valid: true
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    save () {
      if (this.validate()) {
        this.$emit('save', this.password)
      }
    },
    validate () {
      return this.$refs.form.validate()
    }
  }
}
</script>

<style scoped>

</style>
