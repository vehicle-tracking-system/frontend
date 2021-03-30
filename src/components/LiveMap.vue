<template lang="pug">
  div(class="map")
    l-map(style="height: 85vh" :zoom="zoom" :center="center" ref="mymap")
      l-tile-layer(:url="url")
      l-feature-group
        l-marker(v-for="(marker, index) in markers" :key="marker.id" :lat-lng="marker.value")
          l-tooltip(:options="{ permanent: true, interactive: true }")
            div {{ marker.vehicleName }}

      l-control(
        :position="'bottomleft'"
        class="custom-control-watermark"
      ) Vehicle tracking system
      l-control(:position="'bottomright'" class="icons-credits")
        div Icons made by
          a(href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry") Kiranshastry from
          a(href="https://www.flaticon.com/" title="Flaticon")  www.flaticon.com
</template>

<script>
import { latLng } from 'leaflet'
import { LMap, LTileLayer, LMarker, LTooltip, LFeatureGroup, LIcon, LControl } from 'vue2-leaflet'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen'

function Position (vehicleId, latitude, longitude) {
  this.vehicleId = vehicleId
  this.latitude = latitude
  this.longitude = longitude
}

export default {
  Position,
  name: 'OwnMap',
  props: ['markers', 'center', 'waypointsSwitch'],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LFeatureGroup,
    LIcon,
    LControl
  },
  mounted () {
    const map = this.$refs.mymap.mapObject
    map.addControl(new window.L.Control.Fullscreen())
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
