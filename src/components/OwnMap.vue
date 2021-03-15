<template lang="pug">
  div(class="map")
    l-map(style="height: 85vh" :zoom="zoom" :center="center")
      l-tile-layer(:url="url")
      l-feature-group
        l-marker(v-for="(marker, index) in markers" :key="marker.id" :lat-lng="marker.value")
          l-tooltip(:options="{ permanent: true, interactive: true }")
            div {{ marker.vehicleName }}
</template>

<script>
import { latLng } from 'leaflet'
import { LMap, LTileLayer, LMarker, LTooltip, LFeatureGroup, LIcon } from 'vue2-leaflet'

function Position (vehicleId, latitude, longitude) {
  this.vehicleId = vehicleId
  this.latitude = latitude
  this.longitude = longitude
}

export default {
  Position,
  name: 'OwnMap',
  props: ['markers', 'center'],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LFeatureGroup,
    LIcon
  },
  data () {
    return {
      zoom: 8,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      markerLatLng: [47.313220, -1.319482]
    }
  },
  methods: {
    addMarker: function (payload) {
      if (!(payload instanceof Position)) {
        console.log('Payload for new marker must be Position')
        return
      }
      this.markers.push({
        id: payload.vehicleId,
        value: latLng(payload.latitude, payload.longitude),
        car: this.vehicles.find(v => v.id === payload.vehicleId).name
      })
    }
  }
}

</script>

<style scoped lang="scss">

</style>
