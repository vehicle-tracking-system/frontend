<template lang="pug">
  v-list-item(v-if="render" :key='item.vehicle.id' ripple :value="item.vehicle.id" :class="{ 'lightBlue' : isSelected }" @click="itemChanged(item, index)")
    v-list-item-content
      v-list-item-title
        v-row(class="mx-auto pa-2" align="center")
          v-btn(icon classs="mx-2" dark color="second" id="v-live-1")
            v-icon(v-if="!isSelected") mdi-checkbox-blank-circle-outline
            v-icon(v-if="isSelected") mdi-checkbox-marked-circle
          div {{ item.vehicle.name }}

      v-list-item-subtitle(v-if="isSelected && item.position" class="text--primary") {{ item.position.latitude }} {{ item.position.longitude }}
      v-list-item-subtitle(v-else-if="isSelected") Unknown last position
      v-list-item-subtitle(v-if="isSelected && item.position") {{ item.position.speed.toFixed(1) }} km/h
      v-chip-group(column)
        v-chip(v-for="r in item.fleets" :key="r.id") {{ r.name }}
    v-list-item-action(align="center" class="text-center")
      v-tooltip(top style="z-index:9999;")
        template(v-slot:activator="{ on, attrs }")
          v-icon(
            small
            class="mr-3"
            v-bind="attrs"
            v-on="on"
            @click="showVehicleHistory(item)"
            id="v-live-2"
          ) mdi-map-clock
        span Show history
      //v-tooltip(top style="z-index:9999;")
      //  template(v-slot:activator="{ on, attrs }")
      //    v-icon(
      //      small
      //      class="mr-3"
      //      v-bind="attrs"
      //      v-on="on"
      //      @click="showVehicleHistory(item)"
      //    ) mdi-clipboard-list-outline
      //  span Tracks
</template>

<script>
export default {
  name: 'LiveRow',
  props: ['item', 'index', 'isSelected', 'render'],
  methods: {
    itemChanged (item) {
      this.$emit('click', item)
    },
    showVehicleHistory (item) {
      this.$emit('history', item)
    }
  }
}
</script>

<style scoped>

</style>
