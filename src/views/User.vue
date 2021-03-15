<template lang="pug">
  v-container
    v-card(class="mx-auto" tile)
      v-col
        v-avatar(size="100" style="position:absolute; top: 130px")
          v-icon(src="mdi-account")
      v-list-item(color="rgb(255,132,0)")
        v-list-item-content
          v-list-item-title(class="title") {{ this.user.name }}
          v-list-item-subtitle {{ this.user.username }}
          v-list-item-content
            span Roles
              div(v-for="(role, _) in this.user.roles") {{ role }}
</template>

<script>
import axios from 'axios'

export default {
  name: 'User',
  data () {
    return {
      user: null
    }
  },
  created: function () {
    this.user = this.userDetails()
  },
  methods: {
    async userDetails () {
      const config = {
        headers: {
          authorization: this.$store.getters.StateToken
        }
      }
      console.log(this.$store.getters.StateUser)
      await (await axios.get('/user/', config).then(response => {
        this.user = JSON.parse(response.data)
      }))
    }

  }
}
</script>

<style scoped>

</style>
