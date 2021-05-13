<template lang="pug">
  v-dialog(v-model='dialog' max-width="600" persistent)
    v-toolbar.dark(color='primary')
      v-btn(icon dark @click='close')
        v-icon mdi-close
      v-toolbar-title User details
      v-spacer
      v-toolbar-items
        v-btn(v-if="user" dark text @click='save')
          | Save
    v-card
      v-card-title
        span.headline {{ formTitle }}
      v-card-text
        v-container
          v-form(
            ref="form"
            v-model="valid"
            lazy-validation)
            v-row
              v-col(cols='12' sm='6' md='6')
                v-text-field(v-model='user.name'
                  :rules="[rules.required]"
                  label='Name')
              v-col(cols='12' sm='6' md='6')
                v-text-field(v-model='user.username'
                  :rules="[rules.required]"
                  label='Username')
              v-col(v-if="!user.createdAt" offset='3' cols='12' sm='6' md='6' center)
                v-text-field(v-model='user.password'
                  :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPass ? 'text' : 'password'"
                  :rules="[rules.required, rules.min]"
                  label='Password'
                  @click:append="showPass = !showPass")
              v-col(cols='12' sm='12' md='12')
                v-autocomplete(
                  v-model="user.roles"
                  :items="roles"
                  chips
                  label="Roles"
                  multiple)
</template>

<script>
export default {
  props: ['dialog', 'user', 'formTitle'],
  name: 'UserDialog',
  data () {
    return {
      showPass: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => (v && v.length >= 8) || 'Min 8 characters'
      },
      valid: true,
      roles: ['ADMIN', 'USER', 'READER', 'EDITOR']
    }
  },
  methods: {
    save () {
      if (this.validate()) {
        this.$emit('save')
      }
    },
    close () {
      this.$emit('close')
    },
    validate () {
      return this.$refs.form.validate()
    }
  }
}
</script>

<style scoped>

</style>
