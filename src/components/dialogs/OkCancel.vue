<template lang="pug">
  v-dialog(v-model='dialog' max-width='500px')
    v-card
      v-card-title.headline {{ question }}
      v-card-actions
        v-spacer
        v-btn(color='blue darken-1' text='' @click='close') Cancel
        v-btn(color='blue darken-1' text='' @click='confirm') OK
        v-spacer
</template>

<script>
export default {
  name: 'OkCancel',
  props: ['question', 'dialog'],
  methods: {
    close () {
      this.$emit('close')
    },
    confirm () {
      this.$emit('confirm')
    }
  }
}
</script>

<style scoped>

</style>
