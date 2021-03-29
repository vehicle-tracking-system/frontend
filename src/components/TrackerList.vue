<template lang="pug">
  v-container(fluid)
    v-dialog(v-model='dialogDelete' max-width='500px' persistent)
      v-card
        v-card-title.headline Are you sure you want to delete tracker?
        v-card-actions
          v-spacer
          v-btn(color='blue darken-1' text='' @click='closeDelete') Cancel
          v-btn(color='blue darken-1' text='' @click='deleteItemConfirm') OK
          v-spacer

    v-dialog(v-model='dialog' max-width='500px' persistent)
      template(v-slot:activator='{ on, attrs }')
        v-btn.mb-2(color='primary' dark='' v-bind='attrs' v-on='on' @click="newTracker = true; formTitle = 'New tracker'")
          | Add tracker
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
                  v-text-field(v-model='editedItem.name'
                    :rules="[rules.required]"
                    label='Name')
                v-col(cols='12' sm='12' md='12')
                  v-select(
                    v-model="editedItem.vehicleId"
                    :items="vehicles"
                    item-text="name"
                    item-value="id"
                    attach
                    :rules="[rules.required]"
                    label="Vehicle")
        v-card-actions
          v-spacer
          v-btn(color='blue darken-1' text='' @click='close')
            | Cancel
          v-btn(color='blue darken-1' text='' @click='save')
            | Save
    v-dialog(v-model="dialogInfo" max-width='500px')
      v-card
        v-card-title Tracker information
        v-card-text
          v-form(
            readonly=true)
            v-row
              v-col(cols='12' sm='6' md='6')
                v-text-field(v-model='infoItem.tracker.name'
                  label='Name')
              v-col(cols='12' sm='6' md='6')
                v-text-field(
                  v-model="infoItem.vehicle.name"
                  label="Vehicle")
              v-col(cols='12' sm='6' md='6')
                v-text-field(
                  v-model="new Date(infoItem.tracker.createdAt).toLocaleString('cs-CZ')"
                  label="Created")
              v-col(cols='12' sm='6' md='6')
                v-text-field(
                  v-if="infoItem.tracker.deletedAt"
                  v-model="new Date(infoItem.tracker.deletedAt).toLocaleString('cs-CZ')"
                  label="Deleted")
              v-col(cols='12' sm='12' md='12')
                v-text-field(
                  v-model="infoItem.tracker.token"
                  :append-icon="'mdi-content-copy'"
                  ref="token"
                  @click:append="copyToken"
                  label="Token")
    v-dialog(v-model='dialogFull' fullscreen hide-overlay transition='dialog-bottom-transition')
      v-card
        v-toolbar(dark='' color='primary')
          v-btn(icon='' dark='' @click='dialogFull = false')
            v-icon mdi-close
          v-toolbar-title Tracker settings
          v-spacer
          v-toolbar-items
            v-btn(v-if="!infoItem.tracker.deletedAt" dark='' text='' @click='update')
              | Save
        v-list(three-line='' subheader='' :disabled="infoItem.tracker.deletedAt !== null")
          v-subheader Tracker information
          v-list-item
            v-list-item-content
              v-form(
                ref="form"
                v-model="valid"
                lazy-validation)
                v-row
                  v-col(cols='12' sm='6' md='6')
                    v-text-field(v-model='infoItem.tracker.name'
                      label='Name')
                  v-col(cols='12' sm='6' md='6')
                    v-select(
                      v-model="infoItem.tracker.vehicleId"
                      :items="vehicles"
                      item-text="name"
                      item-value="id"
                      attach
                      :rules="[rules.required]"
                      label="Vehicle")
                  v-col(cols='12' sm='6' md='6')
                    v-text-field(
                      v-model="new Date(infoItem.tracker.createdAt).toLocaleString('cs-CZ')"
                      readonly=true
                      label="Created")
                  v-col(cols='12' sm='6' md='6')
                    v-text-field(
                      v-if="infoItem.tracker.deletedAt"
                      v-model="new Date(infoItem.tracker.deletedAt).toLocaleString('cs-CZ')"
                      label="Deleted")
                  v-col(cols='12' sm='12' md='12')
                    v-text-field(
                      v-model="infoItem.tracker.token"
                      readonly=true
                      :append-icon="'mdi-content-copy'"
                      ref="token"
                      @click:append="copyToken"
                      label="Token")
          v-list-item
            v-list-item-content
              v-list-item-title Configuration file
              v-list-item-subtitle Download the file and upload it to the tracker device you want to assign to this profile.
              v-list-item-content
                v-btn(@click="generateConfigFile") DOWNLOAD CONFIG FILE
          v-list-item
            v-list-item-content
              v-list-item-title Token revocation
              v-list-item-subtitle This function generate new authentication token and the old one will be revoked.
                |  After this action, you will need to upload a new configuration to the tracker device!
              v-list-item-content
                v-btn(@click="revokeToken" color="red") REVOKE THE TOKEN
        v-divider
    v-card
      v-card-title
        v-text-field(
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        )
      v-data-table(
        :headers="headers"
        :items="items"
        :search="search"
        @click:row="selectItem"
      )
        template(v-slot:item.status="{ item }")
          v-chip(v-if="item.tracker.deletedAt" color="red") DELETED AT {{ new Date(item.tracker.deletedAt).toLocaleString('cs-CZ') }}
          v-chip(v-else color="second") ACTIVE SINCE {{ new Date(item.tracker.createdAt).toLocaleString('cs-CZ') }}

        template(v-if="isAdmin" v-slot:item.actions="{ item }")
          v-icon(
            small
            class="mr-2"
            @click="deleteItem(item)"
          ) mdi-delete
</template>

<script>
import { saveAs } from 'file-saver'

export default {
  name: 'TrackerList',
  props: ['items', 'vehicles'],
  data () {
    return {
      valid: true,
      search: '',
      showPass: false,
      newTracker: false,
      dialog: false,
      dialogDelete: false,
      dialogInfo: false,
      dialogFull: false,
      formTitle: '',
      rules: {
        required: value => !!value || 'Required.',
        min: v => (v && v.length >= 8) || 'Min 8 characters'
      },
      infoItem: {
        tracker: {
          name: '',
          id: '',
          createdAt: null,
          deletedAt: null,
          token: '',
          vehicleId: 0
        },
        vehicle: {
          name: '',
          id: ''
        }
      },
      infoItemIndex: -1,
      editedIndex: -1,
      editedItem: {
        name: '',
        vehicleId: '',
        roles: ['TRACKER']
      },
      defaultItem: {
        name: '',
        vehicleId: '',
        roles: []
      },
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'tracker.name'
        },
        {
          text: 'Vehicle',
          align: 'start',
          sortable: true,
          value: 'vehicle.name'
        },
        {
          text: 'Status',
          align: 'center',
          sortable: false,
          value: 'status'
        },
        {
          text: '',
          align: 'start',
          sortable: false,
          value: 'actions'
        }
      ]
    }
  },
  watch: {
    dialog (isOpen) {
      if (!isOpen) this.newTracker = false
    }
  },
  computed: {
    isAdmin () {
      return this.$store.getters.StateUser.roles.includes('ADMIN')
    }
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = item
      // this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.items.splice(this.editedIndex, 1)
      this.$emit('deleteTracker', this.editedItem.tracker, this.editedIndex)
      this.closeDelete()
    },
    showInfo (info) {
      this.dialogInfo = true
      this.infoItem = info
      console.log(info)
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      // this.users.push(this.editedItem)
      if (this.validate()) {
        this.$emit('newTracker', this.editedItem)
      }
      if (this.validate()) {
        this.close()
      }
    },
    update () {
      // Object.assign(this.items[this.editedIndex], this.editedItem)
      if (this.validate()) {
        this.$emit('updateTracker', this.infoItem.tracker, this.infoItemIndex)
      }
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    validate () {
      return this.$refs.form.validate()
    },
    copyToken () {
      const textToCopy = this.$refs.token.$el.querySelector('input')
      textToCopy.select()
      document.execCommand('copy')
      this.$snotify.success('Token copied to clipboard', { timeout: 1000 })
    },
    selectItem (tracker) {
      if (this.dialogDelete) return
      this.infoItem = tracker
      this.infoItemIndex = this.items.indexOf(tracker)
      console.log('Info item index ' + this.infoItemIndex)
      console.log(this.infoItem)
      this.dialogFull = true
    },
    generateConfigFile () {
      const blob = new Blob([JSON.stringify({
        token: this.infoItem.tracker.token,
        name: this.infoItem.tracker.name,
        vehicleId: this.infoItem.tracker.vehicleId
      })], { type: 'application/json;charset=utf-8' })
      saveAs(blob, 'config_' + this.infoItem.tracker.name + '.json')
    },
    revokeToken () {
      this.$emit('revokeToken', this.infoItem.tracker, this.infoItemIndex)
    }
  }
}
</script>

<style scoped lang="sass">
</style>
