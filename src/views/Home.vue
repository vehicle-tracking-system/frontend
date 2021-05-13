<template lang="pug">
  v-container(fluid)
    h1
      | Welcome to vehicle tracking system
    p If you already have an account, you can login !{' '}
      router-link(link :to="'/login'") here
      |  (or click the head in top right corner).
    p Did you miss onboarding tour? Never mind! Click !{' '}
      a(@click="showTour") here !{' '}
      | and take a tour one more time.
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods: {
    showTour () {
      this.$store.dispatch('ShowTour')
      this.$tours.myTour.start()
    }
  }
}
</script>
