<template lang="pug">
  v-dialog(v-model='dialog' max-width="600" persistent)
    v-card
      v-toolbar(dark color='primary')
        v-btn(icon dark @click='close')
          v-icon mdi-close
        v-toolbar-title New vehicle
        v-spacer
        v-toolbar-items
          v-btn(dark text @click='save')
            | Save
      v-card-title
        span.headline New vehicle
      v-card-text
        v-container
          v-form(
            ref="form"
            v-model="valid"
            lazy-validation)
            v-row
              v-col(cols='12' sm='6' md='6')
                v-text-field(v-model='vehicle.vehicle.name'
                  :rules="[rules.required]"
                  label='Name')
              v-col(cols='12' sm='6' md='6')
                v-autocomplete(
                  v-model="vehicle.fleets"
                  :items="fleets"
                  :search-input.sync="fleetSearch"
                  :rules="[rules.required]"
                  item-text="name"
                  item-value="id"
                  chips
                  multiple
                  label="Fleets"
                  @change="clearSearch")
                  template(v-slot:no-data)
                    v-list-item
                      v-list-item-content
                        v-list-item-title
                          | Click <v-btn @click="newFleet">{{ fleetSearch }}</v-btn> to create a new fleet
      v-card-actions
        v-spacer
        v-btn(color='blue darken-1' text='' @click='close')
          | Cancel
        v-btn(color='blue darken-1' text='' @click='save')
          | Save
</template>

<script>
export default {
  name: 'NewVehicleDialog',
  props: ['dialog', 'vehicle', 'fleets'],
  data () {
    return {
      rules: {
        required: value => !!value || 'Required.',
        min: v => (v && v.length >= 8) || 'Min 8 characters'
      },
      valid: true,
      roles: ['ADMIN', 'USER', 'READER', 'EDITOR'],
      fleetSearch: ''
    }
  },
  methods: {
    save () {
      if (this.validate()) {
        this.$emit('save')
      } else {
        this.valid = false
      }
    },
    close () {
      this.$emit('close')
    },
    validate () {
      return this.$refs.form.validate()
    },
    newFleet () {
      if (this.fleetSearch !== '') {
        this.$emit('newFleet', this.fleetSearch)
      }
    },
    clearSearch () {
      this.fleetSearch = ''
    }
  }
}
</script>

<style scoped>

</style>
