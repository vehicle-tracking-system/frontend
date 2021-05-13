<template lang="pug">
  l-map(style="height: 93vh" :zoom="zoom" :center="center" ref="mymap")
    l-tile-layer(:url="url")
    l-feature-group
      l-marker(v-for="(marker, index) in markers" :key="marker.id" :lat-lng="marker.value")
        l-tooltip(:options="{ permanent: true, interactive: true }")
          | {{ marker.vehicleName }}
        l-popup
          b {{ marker.vehicleName }}
          div Position: {{ marker.value.lat }}, {{ marker.value.lng }}
          hr
          div Speed: {{ marker.speed }} km/h

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
import { LMap, LTileLayer, LMarker, LTooltip, LFeatureGroup, LIcon, LControl, LPopup } from 'vue2-leaflet'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen'

function Position (vehicleId, latitude, longitude, speed) {
  this.vehicleId = vehicleId
  this.latitude = latitude
  this.longitude = longitude
  this.speed = speed
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
    LControl,
    LPopup
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
  }
}

</script>

<style scoped lang="scss">
</style>
