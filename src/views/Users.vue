<template lang="pug">
  v-card
    div(class="text-center")
      v-progress-circular(
        v-if="usersLoading"
        class="text-center"
        indeterminate
        :size=50
        color="primary"
      )
    UserList(
      v-if="!usersLoading"
      :users="users"
      @newUser="createUser"
      @deleteUser="deleteUser"
      @updateUser="updateUser"
      @newPassword="changePassword"
    )
</template>

<script>
import UserList from '@/components/users/UserList'
import * as api from '@/api/user'

export default {
  name: 'Users',
  components: {
    UserList
  },
  data () {
    return {
      users: [],
      usersLoading: true
    }
  },
  created: function () {
    this.loadUserList()
  },
  methods: {
    async loadUserList () {
      api.getAllUsers().then(r => {
        this.users = r
        this.usersLoading = false
      }).catch(err => {
        if (err.status === -1) this.loadingErr = true
        this.$snotify.error(err.message)
      })
    },
    async updateUser (user, index) {
      api.editUser(user).then(updated => {
        Object.assign(this.users[index], updated)
        this.$snotify.success('User ' + user.username + ' successfully updated.')
      }).catch(e => {
        this.$snotify.error(e.message)
        console.error(e)
      })
    },
    async createUser (user) {
      api.newUser(user).then(usr => {
        this.users.push(usr)
        this.$snotify.success('User ' + user.username + ' successfully created.')
      }).catch(e => {
        this.$snotify.error('Creating user error: ' + e.toString())
        console.error(e)
      })
    },
    async deleteUser (user, index) {
      api.deleteUser(user).then(usr => {
        this.users.splice(index, 1)
        this.$snotify.success('User ' + user.name + ' successfully deleted.')
      }).catch(e => {
        this.$snotify.error('Deleting user error: ' + e.toString())
        console.error(e)
      })
    },
    async changePassword (user, password) {
      api.changePassword(user.id, password).then(usr => {
        this.$snotify.success('User ' + user.name + ' successfully deleted.')
      }).catch(e => {
        this.$snotify.error('Deleting user error: ' + e.toString())
        console.error(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
