<template lang="pug">
  div
    v-list
      v-list-item.px-2
        v-list-item-avatar
          v-icon(color='white') mdi-map-marker
      v-list-item(link='' :to="isLogin ? '/profile' : '/login'")
        v-list-item-content(id="v-step-1-1")
          v-list-item-title.title {{ name }}
          v-list-item-subtitle {{ username }}
        v-icon(v-if="isLogin" @click="logout" id="v-step-1") mdi-logout
        v-icon(v-else) mdi-login
    v-divider
    v-list(nav dense)
      v-list-item(v-for='item in items' :key='item.title' link='' :to='item.href')
        v-list-item-icon
          v-icon(color='primary' v-bind:id="item.tour") {{ item.icon }}
        v-list-item-content
          v-list-item-title.primary--text {{ item.title }}
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Navigation',
  computed: {
    username: function () {
      if (this.$store.getters.isAuthenticated) {
        return this.$store.getters.StateUser.username
      } else {
        return ''
      }
    },
    name: function () {
      if (this.$store.getters.isAuthenticated) {
        return this.$store.getters.StateUser.name
      } else {
        return 'Anonymous'
      }
    },
    isLogin: function () {
      return this.$store.getters.isAuthenticated
    }
  },
  data () {
    return {
      items: [
        {
          tour: 'v-step-2',
          title: 'Live positions',
          href: '/live',
          icon: 'mdi-map-search'
        },
        {
          tour: 'v-step-3',
          title: 'Vehicles',
          href: '/vehicles',
          icon: 'mdi-car'
        },
        {
          tour: 'v-step-4',
          title: 'Trackers',
          href: '/trackers',
          icon: 'mdi-antenna'
        },
        {
          tour: 'v-step-5',
          title: 'Users',
          href: '/users',
          icon: 'mdi-account-multiple'
        }
      ]
    }
  },
  methods: {
    ...mapActions(['LogOut']),
    logout: function () {
      this.LogOut()
    }
  }
}
</script>

<style scoped>

</style>
