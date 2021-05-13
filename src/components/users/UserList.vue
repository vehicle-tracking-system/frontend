<template lang="pug">
  v-card
    v-toolbar(color="primary" rounded=0)
      v-toolbar-title.text-overline Users
      v-toolbar-items
        //v-btn.mb-2(dark @click="newUser = true; formTitle = 'New user'; dialog= true" text right)
        //  | New user
    v-container(fluid)
      OkCancel(
        :question = "'Are you sure you want to delete user?'"
        :dialog="dialogDelete"
        @close="closeDelete"
        @confirm="deleteItemConfirm"
      )
      UserDialog(
        :dialog="dialog"
        :user="editedItem"
        @close="close"
        @save="save")
      NewPasswordDialog(
        :dialog="passDialog"
        @close="passDialog = false"
        @save="newPassword"
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
            :items="users"
            :search="search"
            @click:row="editItem"
          )
            template(v-slot:item.roles="{ item }")
              v-chip-group
                v-chip(v-for="r in item.roles" :key="r") {{ r }}

            template(v-if="isAdmin" v-slot:item.actions="{ item }")
              v-tooltip(top)
                template(v-slot:activator="{ on, attrs }")
                  v-icon(
                    small
                    class="mr-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="openPassDialog(item)"
                  ) mdi-lock-reset
                span Change password
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
    v-speed-dial(fixed right bottom)
      template(v-slot:activator='')
        v-btn(color='success' fab dark  @click="newUser = true; formTitle = 'New user'; dialog= true")
          v-icon
            | mdi-plus
</template>

<script>
import OkCancel from '@/components/dialogs/OkCancel'
import UserDialog from '@/components/users/UserDialog'
import NewPasswordDialog from '@/components/users/NewPasswordDialog'

export default {
  name: 'UserList',
  components: {
    NewPasswordDialog,
    UserDialog,
    OkCancel
  },
  props: ['users'],
  data () {
    return {
      search: '',
      showPass: false,
      newUser: false,
      dialog: false,
      passDialog: false,
      dialogDelete: false,
      formTitle: '',
      editedIndex: -1,
      editedItem: {
        name: '',
        username: '',
        roles: ['USER']
      },
      defaultItem: {
        name: '',
        username: '',
        roles: []
      },
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Username',
          align: 'start',
          sortable: false,
          value: 'username'
        },
        {
          text: 'Roles',
          align: 'start',
          sortable: false,
          value: 'roles'
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
      if (!isOpen) this.newUser = false
    }
  },
  computed: {
    isAdmin () {
      return this.$store.getters.StateUser.roles.includes('ADMIN')
    }
  },
  methods: {
    editItem (item) {
      if (this.dialogDelete || this.passDialog || !this.isAdmin) return
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = item
      // this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.$emit('deleteUser', this.editedItem, this.editedIndex)
      this.closeDelete()
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem)
        this.$emit('updateUser', this.editedItem, this.editedIndex)
      } else {
        this.$emit('newUser', this.editedItem)
      }
      this.dialog = false
    },
    openPassDialog (item) {
      this.editedItem = item
      this.passDialog = true
    },
    newPassword (password) {
      this.$emit('newPassword', this.editedItem, password)
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      this.passDialog = false
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
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
