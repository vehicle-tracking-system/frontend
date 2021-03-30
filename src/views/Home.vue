<template lang="pug">
  v-container(fluid)
    h1
      | Welcome to vehicle tracking system
    p If you already have an account, you can login !{' '}
      router-link(link :to="'/login'") here
      |  (or click the head in top right corner).

</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
