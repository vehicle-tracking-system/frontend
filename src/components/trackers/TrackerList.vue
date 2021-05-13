<template lang="pug">
  v-card
    v-toolbar(color="primary" rounded=0)
      v-toolbar-title.text-overline Trackers
      //v-toolbar-items
      //  v-btn.mb-2(dark @click="newTracker = true; formTitle = 'New tracker'; dialog = true" text right)
      //    | New tracker
    v-container(fluid)
      OkCancel(
        :question = "'Are you sure you want to delete tracker?'"
        :dialog="dialogDelete"
        @close="closeDelete"
        @confirm="deleteItemConfirm"
      )
      NewTrackerDialog(
        :dialog="dialog"
        :vehicles="vehicles"
        :tracker="editedItem"
        @close="close"
        @save="save"
      )
      TrackerDialog(
        :dialog="dialogUpdate"
        :item="infoItem"
        :vehicles="vehicles"
        @save="update"
        @close="dialogUpdate = false"
        @revokeToken="revokeToken"
      )
      v-card
        v-card-title
          v-text-field(
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          )
        v-card-text
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
              v-tooltip(top)
                template(v-slot:activator="{ on, attrs }")
                  v-icon(
                    small
                    class="mr-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="deleteItem(item)"
                  ) mdi-delete
                span Delete
        v-card-actions
    v-speed-dial(fixed right bottom)
      template(v-slot:activator='')
        v-btn(color='success' fab dark  @click="newTracker = true; formTitle = 'New tracker'; dialog = true")
          v-icon
            | mdi-plus
</template>

<script>
import NewTrackerDialog from '@/components/trackers/NewTrackerDialog'
import OkCancel from '@/components/dialogs/OkCancel'
import TrackerDialog from '@/components/trackers/TrackerDialog'

export default {
  name: 'TrackerList',
  components: {
    TrackerDialog,
    OkCancel,
    NewTrackerDialog
  },
  props: ['items', 'vehicles'],
  data () {
    return {
      search: '',
      newTracker: false,
      dialog: false,
      dialogDelete: false,
      dialogUpdate: false,
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
        vehicleId: ''
      },
      defaultItem: {
        name: '',
        vehicleId: ''
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
      this.dialogDelete = true
    },
    deleteItemConfirm () {
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
      this.$emit('newTracker', this.editedItem)
      this.dialog = false
    },
    update () {
      this.$emit('updateTracker', this.infoItem.tracker, this.infoItemIndex)
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    selectItem (tracker) {
      if (this.dialogDelete) return
      this.infoItem = tracker
      this.infoItemIndex = this.items.indexOf(tracker)
      console.log('Info item index ' + this.infoItemIndex)
      console.log(this.infoItem)
      this.dialogUpdate = true
    },
    revokeToken () {
      this.$emit('revokeToken', this.infoItem.tracker, this.infoItemIndex)
    }
  }
}
</script>

<style scoped>
.v-speed-dial {
  /*position: absolute;*/
  padding-bottom: 35px;
}
</style>
