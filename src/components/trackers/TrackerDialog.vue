<template lang="pug">
  v-dialog(v-model='dialog' fullscreen transition='dialog-bottom-transition')
    v-card
      v-toolbar(dark color='primary')
        v-btn(icon dark @click='close')
          v-icon mdi-close
        v-toolbar-title Tracker settings
        v-spacer
        v-toolbar-items
          v-btn(v-if="!item.tracker.deletedAt" dark text @click='save')
            | Save
      v-list(three-line subheader :disabled="item.tracker.deletedAt !== null")
        v-subheader Tracker information
        v-list-item
          v-list-item-content
            v-form(
              ref="form"
              v-model="valid"
              lazy-validation)
              v-row
                v-col(cols='12' sm='6' md='6')
                  v-text-field(v-model='item.tracker.name'
                    label='Name')
                v-col(cols='12' sm='6' md='6')
                  v-autocomplete(
                    v-model="item.tracker.vehicleId"
                    :items="vehicles"
                    item-text="name"
                    item-value="id"
                    :rules="[rules.required]"
                    label="Vehicle")
                v-col(cols='12' sm='6' md='6')
                  v-text-field(
                    v-model="new Date(item.tracker.createdAt).toLocaleString('cs-CZ')"
                    readonly=true
                    label="Created")
                v-col(cols='12' sm='6' md='6')
                  v-text-field(
                    v-if="item.tracker.deletedAt"
                    v-model="new Date(item.tracker.deletedAt).toLocaleString('cs-CZ')"
                    label="Deleted")
                v-col(cols='12' sm='12' md='12')
                  v-text-field(
                    v-model="item.tracker.token"
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
</template>

<script>
// import { saveAs } from 'file-saver'
import axios from 'axios'

export default {
  name: 'TrackerDialog',
  props: ['dialog', 'item', 'vehicles'],
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
      this.$emit('save')
    },
    close () {
      this.$emit('close')
    },
    revokeToken () {
      this.$emit('revokeToken')
    },
    copyToken () {
      const textToCopy = this.$refs.token.$el.querySelector('input')
      textToCopy.select()
      document.execCommand('copy')
      this.$snotify.success('Token copied to clipboard', { timeout: 1000 })
    },
    generateConfigFile () {
      axios.get('/tracker/config',
        {
          responseType: 'blob',
          params: {
            id: this.item.tracker.id
          }
        })
        .then(res => {
          const fileURL = window.URL.createObjectURL(new Blob([res.data]))
          const fileLink = document.createElement('a')
          fileLink.href = fileURL
          fileLink.setAttribute('download', 'config_' + this.item.tracker.id + '.json')
          document.body.appendChild(fileLink)

          fileLink.click()
        })
      // const blob = new Blob([JSON.stringify({
      //   token: this.item.tracker.token,
      //   name: this.item.tracker.name,
      //   vehicleId: this.item.tracker.vehicleId
      // })], { type: 'application/json;charset=utf-8' })
      // saveAs(blob, 'config_' + this.item.tracker.name + '.json')
    },
    configFileUrl () {
      return this.axios.defaults.baseURL + '/config?id=' + this.item.tracker.id
    }
  }
}
</script>

<style scoped>

</style>
