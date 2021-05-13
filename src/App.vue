<template lang="pug">
  v-app
    v-navigation-drawer(v-if="isLoggedIn" v-bind:expand-on-hover="onHover" :mini-variant.sync="mini" v-model='sidebarMenu' app floating permanent)
      Navigation(id="v-step-0")
    v-main
      v-tour(name="myTour" :steps="steps" :callbacks="callbacks")
      v-container.px-0.py-0.pa-0.ma-0(fluid full-height)
        v-row.fill-height
          v-col
            transition(name='fade')
              router-view
    v-footer(padless)
      v-col(
        class="text-center"
        cols="12") {{ new Date().getFullYear() }} — <strong>Vehicle tracking system</strong>
    vue-snotify
</template>

<script>
import Navigation from '@/components/Navigation'

export default {
  name: 'App',

  components: {
    Navigation
  },
  mounted () {
    if (this.isNew && this.isLoggedIn) {
      this.$tours.myTour.start()
    }
  },
  watch: {
    isLoggedIn (newVal) {
      if (this.isNew && newVal) {
        this.$tours.myTour.start()
      }
    }
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isAuthenticated
    },
    username: function () {
      return this.$store.getters.StateUser.username
    },
    smallScreen () {
      return this.$vuetify.breakpoint.mdAndDown
    },
    isNew () {
      return this.$store.getters.showTour
    },
    callbacks () {
      return {
        onFinish: this.hideTour,
        onSkip: this.hideTour
      }
    }
  },
  data: function () {
    return {
      appTitle: 'Vehicle tracking system',
      sidebarMenu: true,
      toggleMini: true,
      mini: true,
      onHover: true,
      steps: [
        {
          target: '#v-step-0', // We're using document.querySelector() under the hood
          header: {
            title: 'Get Started'
          },
          before: type => new Promise((resolve, reject) => {
            // Time-consuming UI/async operation here
            setTimeout(resolve, 250)
          }),
          content: 'There is a menu for browsing the application! Don\'t be scared, it\'s easy!'
        },
        {
          target: '#v-step-1',
          header: {
            title: 'Login'
          },
          params: {
            highlight: true
          },
          before: () => Promise.resolve().then(data => {
            this.onHover = false
            this.mini = false
          }),
          content: 'If you click this icon, you will be redirect to login page. Once you are logged in, the same button is used for logout.'
        },
        {
          target: '#v-step-1-1',
          header: {
            title: 'Profile'
          },
          params: {
            highlight: true
          },
          content: 'Click on your name to view your profile. If you are not logged in, you will be prompted to enter your credentials.'
        },
        {
          target: '#v-step-2',
          header: {
            title: 'Live positions'
          },
          params: {
            highlight: true
          },
          before: () => Promise.resolve().then(data => {
            this.onHover = true
            this.mini = true
          }),
          content: 'Live positions enable show you where your vehicles are right now.'
        },
        {
          target: '#v-step-3',
          header: {
            title: 'Vehicles'
          },
          params: {
            highlight: true
          },
          content: 'Here you can find list of vehicles. You can also edit them here and create new ones.'
        },
        {
          target: '#v-step-4',
          header: {
            title: 'Trackers'
          },
          params: {
            highlight: true
          },
          content: 'Here you can find list of trackers. You can also edit them here and create new ones.'
        },
        {
          target: '#v-step-5',
          header: {
            title: 'Users'
          },
          params: {
            highlight: true
          },
          content: 'Here you can find list of users. You can also edit them here and create new ones.'
        }
      ],
      items: [
        {
          title: 'Live positions',
          href: '/vehicles-live',
          icon: 'mdi-map-search'
        },
        {
          title: 'Vehicles',
          href: '/vehicles',
          icon: 'mdi-car'
        },
        {
          title: 'Trackers',
          href: '/trackers',
          icon: 'mdi-antenna'
        },
        {
          title: 'Users',
          href: '/users',
          icon: 'mdi-account-multiple'
        }
        // { title: 'Components', href: '/comp', icon: 'mdi-palette-swatch' },
        // { title: 'Customers', href: '/customers', icon: 'mdi-account-search-outline' },
        // { title: 'Orders', href: '/orders', icon: 'mdi-bus-clock' },
        // { title: 'Settings', href: '/settings', icon: 'mdi-clock' }
      ]
    }
  },
  methods: {
    async logout () {
      await this.$store.dispatch('LogOut')
      await this.$router.push('/login')
    },
    hideTour () {
      this.$store.dispatch('HideTour')
    }
  }
}
</script>

<style scoped lang="scss">
#footer {
  text-align: center;
}
html {
  overflow: hidden !important;
}
</style>
