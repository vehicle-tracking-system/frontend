<template lang="pug">
  v-card
    v-toolbar(color="primary" rounded=0)
      v-toolbar-title.text-overline Vehicles
      v-toolbar-items
        //v-btn.mb-2(dark @click="newVehicle = true; dialog= true" text right)
        //  | New vehicle
    v-container(fluid)
      OkCancel(
        :question = "'Are you sure you want to delete vehicle?'"
        :dialog="dialogDelete"
        @close="closeDelete"
        @confirm="deleteItemConfirm"
      )
      NewVehicleDialog(
        :dialog="dialog"
        :vehicle="editedItem"
        :fleets="fleets"
        @close="close"
        @save="save"
        @newFleet="newFleet"
      )
      VehicleDialog(
        :dialog="dialogFull",
        :fleets="fleets",
        :vehicle="infoItem"
        @close="dialogFull = false"
        @save="update"
        @newFleet="newFleet"
      )
      v-card
        v-card-title
          v-text-field(
            v-model="search"
            id="create"
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
            template(v-slot:item.fleets="{ item }")
              v-chip-group
                v-chip(v-for="r in item.fleets" :key="r.id") {{ r.name }}

            template(v-slot:item.actions="{ item }")
              v-tooltip(top)
                template(v-slot:activator="{ on, attrs }")
                  v-icon(
                    small
                    v-bind="attrs"
                    v-on="on"
                    class="mr-2"
                    @click="showHistory(item)"
                  ) mdi-map-clock
                span Show history
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
          v-btn(color='success' fab dark  @click="newVehicle = true; dialog= true")
            v-icon
              | mdi-plus
          //v-col(class="text-right")
            //v-btn.mx-2(rounded dark color='success')
            //  v-icon(dark='')
            //   | mdi-plus
            //  div New vehicle

            //v-btn.mb-2(color="success" @click="newVehicle = true; dialog= true")
            //  | New vehicle
</template>

<script>
import OkCancel from '@/components/dialogs/OkCancel'
import NewVehicleDialog from '@/components/vehicles/NewVehicleDialog'
import VehicleDialog from '@/components/vehicles/VehicleDialog'

export default {
  name: 'VehicleList',
  components: {
    VehicleDialog,
    NewVehicleDialog,
    OkCancel
  },
  props: ['items', 'fleets'],
  data () {
    return {
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: 'slide-y-reverse-transition',
      valid: true,
      search: '',
      showPass: false,
      newVehicle: false,
      dialog: false,
      dialogDelete: false,
      dialogInfo: false,
      dialogFull: false,
      formTitle: '',
      fleetSearch: null,
      rules: {
        required: value => !!value || 'Required.',
        min: v => (v && v.length >= 8) || 'Min 8 characters'
      },
      infoItem: {
        vehicle: {
          name: '',
          id: '',
          createdAt: null,
          deletedAt: null,
          token: ''
        },
        fleets: []
      },
      infoItemIndex: -1,
      editedIndex: -1,
      editedItem: {
        vehicle: {
          name: ''
        },
        fleets: []
      },
      defaultItem: {
        vehicle: {
          name: '',
          id: '',
          createdAt: null,
          deletedAt: null,
          token: ''
        },
        fleets: []
      },
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'vehicle.name'
        },
        {
          text: 'Fleets',
          align: 'start',
          sortable: false,
          value: 'fleets'
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
      if (!isOpen) this.newVehicle = false
    }
  },
  computed: {
    isAdmin () {
      return this.$store.getters.StateUser.roles.includes('ADMIN')
    }
  },
  methods: {
    deleteItem (item) {
      console.log(item)
      console.log(this.items)
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = item
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.$emit('deleteVehicle', this.editedItem.vehicle, this.editedIndex)
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
      this.$emit('newVehicle', this.editedItem)
      this.close()
    },
    update () {
      this.$emit('updateVehicle', this.infoItem, this.infoItemIndex)
      this.dialogFull = false
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
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
    showHistory (vehicle) {
      console.log(vehicle.vehicle.id)
      this.$router.push('/history?id=' + vehicle.vehicle.id)
    },
    newFleet (fleet) {
      this.$emit('newFleet', fleet)
    }
  }
}
</script>

<style scoped>
.v-speed-dial {
  /*position: absolute;*/
  padding-bottom: 35px;
}

#create .v-btn--floating {
  position: relative;
}
</style>
