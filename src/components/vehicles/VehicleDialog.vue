<template lang="pug">
  v-dialog(v-model='dialog' max-width="600" persistent hide-overlay)
    v-card
      v-toolbar(dark color='primary')
        v-btn(icon dark @click='close')
          v-icon mdi-close
        v-toolbar-title Vehicle details
        v-spacer
        v-toolbar-items
          v-btn(v-if="!vehicle.vehicle.deletedAt" dark text @click='save')
            | Save
      v-card-text
        v-list(three-line subheader)
          v-subheader Vehicle information
          v-list-item
            v-list-item-content
              v-form(
                ref="form"
                v-model="valid"
                lazy-validation)
                v-row
                  v-col(cols='12' sm='6' md='6')
                    v-text-field(v-model='vehicle.vehicle.name'
                      label='Name')
                  v-col(cols='12' sm='6' md='6')
                    v-text-field(
                      v-model="new Date(vehicle.vehicle.createdAt).toLocaleString('cs-CZ')"
                      readonly=true
                      label="Created")
                  v-col(cols='12' sm='6' md='6')
                    v-autocomplete(
                      v-model="vehicle.fleets"
                      :items="fleets"
                      :search-input.sync="fleetSearch"
                      :rules="[rules.required]"
                      item-text="name"
                      return-object=true
                      chips
                      multiple
                      label="Fleets"
                      @change="clearSearch")
                      template(v-slot:no-data)
                        v-list-item
                          v-list-item-content
                            v-list-item-title
                              | Click <v-btn @click="newFleet">{{ fleetSearch }}</v-btn> to create a new fleet
                  v-col(cols='12' sm='6' md='6')
                    v-text-field(
                      v-if="vehicle.deletedAt"
                      v-model="new Date(vehicle.deletedAt).toLocaleString('cs-CZ')"
                      label="Deleted")

        //v-divider
          //v-list-item
        //  v-list-item-content
        //    v-card
        //        v-btn(@click="showHistory(infoItem)") Show history
        //          v-icon(
        //            medium
        //            class="mr-2"
        //          ) mdi-map-clock
        //        v-btn(@click="showHistory(infoItem)" color="red") Delete
        //          v-icon(v-if="isAdmin"
        //            large
        //            class="mr-2"
        //            @click="deleteItem(item)"
        //          ) mdi-delete

</template>

<script>
export default {
  name: 'VehicleDialog',
  props: ['dialog', 'vehicle', 'fleets'],
  data () {
    return {
      rules: {
        required: value => !!value || 'Required.',
        min: v => (v && v.length >= 8) || 'Min 8 characters'
      },
      valid: true,
      fleetSearch: ''
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
    newFleet () {
      if (this.fleetSearch !== '') {
        this.$emit('newFleet', this.fleetSearch)
      }
    },
    validate () {
      return this.$refs.form.validate()
    },
    clearSearch () {
      this.fleetSearch = ''
    }
  }
}
</script>

<style scoped>

</style>
