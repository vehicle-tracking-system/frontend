<template lang="pug">
  div
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
      @deleteUser=""
      @updateUser="updateUser"
    )
</template>

<script>
import UserList from '@/components/UserList'
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
      api.getAllUsers(this.$store.getters.StateToken).then(r => {
        this.users = r
        this.usersLoading = false
      }).catch(err => {
        if (err.status === -1) this.loadingErr = true
        this.$snotify.error(err.message)
      })
    },
    async updateUser (user, index) {
      api.editUser(user, this.$store.getters.StateToken).then(updated => {
        Object.assign(this.users[index], updated)
        this.$snotify.success('User ' + user.name + ' successfully updated.')
      }).catch(e => {
        this.$snotify.error(e.message)
        console.error(e)
      })
    },
    async createUser (user) {
      api.newUser(user, this.$store.getters.StateToken).then(usr => {
        this.users.push(usr)
      }).catch(e => {
        this.$snotify.error('Creating user error: ' + e.toString())
        console.error(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
