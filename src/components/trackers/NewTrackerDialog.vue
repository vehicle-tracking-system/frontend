<template lang="pug">
  v-dialog(v-model='dialog' max-width='500px' persistent)
    v-card
      v-toolbar(dark color='primary')
        v-btn(icon dark @click='close')
          v-icon mdi-close
        v-toolbar-title New tracker
        v-spacer
        v-toolbar-items
          v-btn(dark text @click='save')
            | Save
      v-card-title
        span.headline New tracker
      v-card-text
        v-container
          v-form(
            ref="form"
            v-model="valid"
            lazy-validation)
            v-row
              v-col(cols='12' sm='12' md='12')
                v-text-field(v-model='tracker.name'
                  :rules="[rules.required]"
                  label='Name')
              v-col(cols='12' sm='12' md='12')
                v-select(
                  v-model="tracker.vehicleId"
                  :items="vehicles"
                  item-text="name"
                  item-value="id"
                  :rules="[rules.required]"
                  label="Vehicle")
      v-card-actions
        v-spacer
        v-btn(color='blue darken-1' text='' @click='close')
          | Close
        v-btn(color='blue darken-1' text='' @click='save')
          | Save
</template>

<script>
export default {
  name: 'NewTrackerDialog',
  props: ['dialog', 'tracker', 'vehicles'],
  data () {
    return {
      rules: {
        required: value => !!value || 'Required.',
        min: v => (v && v.length >= 8) || 'Min 8 characters'
      },
      valid: true
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
