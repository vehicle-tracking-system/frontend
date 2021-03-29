<template lang="pug">
  v-container(fluid)
    v-dialog(v-model='dialogDelete' max-width='500px')
      v-card
        v-card-title.headline Are you sure you want to delete user?
        v-card-actions
          v-spacer
          v-btn(color='blue darken-1' text='' @click='closeDelete') Cancel
          v-btn(color='blue darken-1' text='' @click='deleteItemConfirm') OK
          v-spacer

    v-dialog(v-model='dialog' fullscreen hide-overlay transition='dialog-bottom-transition')
      v-toolbar(dark='' color='primary')
        v-btn(icon='' dark='' @click='dialog = false')
          v-icon mdi-close
        v-toolbar-title User details
        v-spacer
        v-toolbar-items
          v-btn(v-if="editedItem" dark='' text='' @click='update')
            | Save
      template(v-slot:activator='{ on, attrs }')
        v-btn.mb-2(color='primary' dark='' v-bind='attrs' v-on='on' @click="newUser = true; formTitle = 'New user'")
          | New user
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
                v-col(cols='12' sm='6' md='6')
                  v-text-field(v-model='editedItem.username'
                    :rules="[rules.required]"
                    label='Username')
                v-col(v-if="newUser" offset='3' cols='12' sm='6' md='6' center)
                  v-text-field(v-model='editedItem.password'
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPass ? 'text' : 'password'"
                    :rules="[rules.required, rules.min]"
                    label='Password'
                    @click:append="showPass = !showPass")
                v-col(cols='12' sm='12' md='12')
                  v-select(
                    v-model="editedItem.roles"
                    :items="roles"
                    attach
                    chips
                    label="Roles"
                    multiple)
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
        :items="users"
        :search="search"
        @click:row="editItem"
      )
        template(v-slot:item.roles="{ item }")
          v-chip-group
            v-chip(v-for="r in item.roles" :key="r") {{ r }}

        template(v-if="isAdmin" v-slot:item.actions="{ item }")
          v-icon(
            small
            class="mr-2"
            @click="deleteItem(item)"
          ) mdi-delete
</template>

<script>
export default {
  name: 'UserList',
  props: ['users'],
  data () {
    return {
      valid: true,
      search: '',
      showPass: false,
      newUser: false,
      dialog: false,
      dialogDelete: false,
      formTitle: '',
      rules: {
        required: value => !!value || 'Required.',
        min: v => (v && v.length >= 8) || 'Min 8 characters'
      },
      roles: ['ADMIN', 'USER', 'READER', 'EDITOR'],
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
          text: 'Actions',
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
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.users.indexOf(item)
      const deletedItem = this.editedItem
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
      this.$emit('deleteUser', deletedItem)
    },

    deleteItemConfirm () {
      this.users.splice(this.editedIndex, 1)
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
        if (this.validate()) {
          this.$emit('updateUser', this.editedItem, this.editedIndex)
        }
      } else {
        // this.users.push(this.editedItem)
        if (this.validate()) {
          this.$emit('newUser', this.editedItem)
        }
      }
      if (this.validate()) {
        this.close()
      }
    },
    update () {
      if (this.validate()) {
        this.$emit('updateUser', this.editedItem, this.editedIndex)
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
    }
  }
}
</script>

<style scoped lang="sass">
</style>
