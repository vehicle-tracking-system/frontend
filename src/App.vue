<template>
  <v-app>
      <v-app-bar app color="primary" dark elevation="0">
      <v-app-bar-nav-icon @click.stop="sidebarMenu = !sidebarMenu"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
        <v-btn icon href="/login">
          <v-icon>mdi-account</v-icon>
        </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="sidebarMenu"
      app
      floating
      :permanent="sidebarMenu"
      :mini-variant.sync="mini"
    >
      <v-list dense color="primary" dark>
        <v-list-item>
          <v-list-item-action>
            <v-icon @click.stop="sidebarMenu = !sidebarMenu">mdi-chevron-left</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <h3 class="font-weight-thin">Vehicle tracking system</h3>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div v-if="isLoggedIn">
        <v-list-item class="px-2" @click="toggleMini = !toggleMini">
          <v-list-item-avatar>
            <v-icon>mdi-account-outline</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-truncate">
            {{ username }}
          </v-list-item-content>
          <v-btn icon small>
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
        <v-divider></v-divider>
        <v-list>
          <v-list-item v-for="item in items" :key="item.title" link :to="item.href">
            <v-list-item-icon>
              <v-icon color="primary">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="primary--text">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>
    <v-main>
      <v-container class="px-4 py-0 fill-height" fluid>
        <v-row class="fill-height">
          <v-col>
            <transition name="fade">
              <router-view></router-view>
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer>
      ...
    </v-footer>

    <vue-snotify/>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',

  components: {
    // HelloWorld
  },

  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isAuthenticated
    },
    username: function () {
      return this.$store.getters.StateUser.username
    },
    mini () {
      return (this.$vuetify.breakpoint.smAndDown) || this.toggleMini
    }
  },

  methods: {
    async logout () {
      await this.$store.dispatch('LogOut')
      await this.$router.push('/login')
    }
  },

  data: () => ({
    appTitle: 'Vehicle tracking system',
    sidebarMenu: false,
    toggleMini: true,
    items: [
      { title: 'Home', href: '/user', icon: 'mdi-home-outline' },
      { title: 'Live positions', href: '/vehicles', icon: 'mdi-map-search' },
      { title: 'Trackers', href: '/trackers', icon: 'mdi-antenna' }
      // { title: 'Components', href: '/comp', icon: 'mdi-palette-swatch' },
      // { title: 'Customers', href: '/customers', icon: 'mdi-account-search-outline' },
      // { title: 'Orders', href: '/orders', icon: 'mdi-bus-clock' },
      // { title: 'Settings', href: '/settings', icon: 'mdi-clock' }
    ]
  })
}
</script>
