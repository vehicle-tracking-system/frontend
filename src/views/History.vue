<template lang="pug">
  v-container(fluid)
    v-row(no-gutters justify="space-around")
      v-col(cols="12" md="3" xs="12" sm="12")
        v-date-picker(
          color="primary"
          v-model="dates"
          range
          full-width
          @change="dateSelected"
        )
        v-text-field(
          v-model="dateRangeText"
          label="Date range"
          prepend-icon="mdi-calendar"
          readonly)
        v-text-field(
          v-model="(totalDistance / 1000).toFixed(2)+ ' km'"
          label="Total distance"
          prepend-icon="mdi-map-marker-distance"
          readonly)

      v-col(cols="12" md="9" xs="12" sm="12")
        div(class="map")
          l-map(
            style="height: 85vh"
            :zoom="zoom"
            :center="center"
            :bounds="bounds")
            l-tile-layer(:url="url")
            l-layer-group(layer-type="overlay" name="route")
              l-polyline(
                v-for="item in polylines"
                :key="item.id"
                :lat-lngs="item.points"
                :visible="true"
                @click="alert(item)"
              )
              l-marker(v-for="(marker, index) in markers" :key="marker.id" :lat-lng="marker.value" :icon="marker.icon")
                l-tooltip(:options="{ permanent: false, interactive: true }")
                  div {{ marker.time }}
                  div {{ marker.speed }}
                  div {{ marker.value.lat }} {{ marker.value.lng }}

</template>

<script>
import {
  LControlAttribution,
  LControlLayers,
  LControlScale,
  LControlZoom,
  LLayerGroup,
  LMap,
  LMarker,
  LPolyline,
  LPopup,
  LTileLayer,
  LTooltip
} from 'vue2-leaflet'
import { icon, latLng, latLngBounds } from 'leaflet'
import axios from 'axios'

export default {
  name: 'Vehicle',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
    LLayerGroup,
    LTooltip,
    LPopup,
    LControlZoom,
    LControlAttribution,
    LControlScale,
    LControlLayers
  },
  data () {
    return {
      zoom: 7,
      center: latLng(49.7437572, 15.3386383),
      bounds: latLngBounds(latLng(49.7437572, 15.3386383), latLng(49.7437572, 15.3386383)),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      start_icon: icon({
        iconUrl: require('../assets/car_blue.svg'),
        iconSize: [32, 37],
        iconAnchor: [16, 37]
      }),
      end_icon: icon({
        iconUrl: require('../assets/car_red.svg'),
        iconSize: [32, 37],
        iconAnchor: [16, 37]
      }),
      pointIcon: icon({
        iconUrl: require('../assets/dot.svg'),
        iconSize: [13, 15],
        iconAnchor: [4, 7]
      }),
      polylines: [],
      markers: [],
      points: [],
      dates: ['', ''],
      vehicleId: null,
      totalDistance: 0
    }
  },
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    }
  },
  created: function () {
    this.vehicleId = this.$route.query.id
    if (this.vehicleId === undefined) {
      this.$snotify.error('Vehicle ID must be provided')
    }

    const today = new Date()
    const day = today.getDate().toString().padStart(2, '0')
    const month = (today.getMonth() + 1).toString().padStart(2, '0')
    const date = today.getFullYear() + '-' + month + '-' + day
    this.dates = [date, date]
  },
  methods: {
    loadPolyLine: function () {
    },
    async dateSelected () {
      this.loadingTracks = true
      api.vehicleHistory(this.vehicleId, this.dates[0], this.dates[1]).then(response => {
        this.loadingTracks = false

        if (response.length === 0) {
          this.$snotify.warning('No data available for the selected date period:\n' + this.dateRangeText)
          return
        }
        this.polylines = [{
          id: 'route',
          points: payload.map(point => latLng(point.latitude, point.longitude)),
          visible: true
        }]
        const start = response.data[response.data.length - 1]
        const end = response.data[0]
        start.icon = this.start_icon
        end.icon = this.end_icon
        this.addMarkers([start, end])
        this.addMarkers(response.data)
        this.fitPolyline()
      }).catch(error => {
        console.log(error)
        switch (error.response.status) {
          case 403:
            this.$snotify.error('You don\'t have permissions to view vehicle positions history!', { timeout: 10000 })
            break
          default:
            this.$snotify.error('Unexpected error occurred: ' + error, { timeout: 10000 })
        }
      })
    },
    addMarkers: function (payload) {
      this.markers = []
      this.totalDistance = 0
      for (const m in payload) {
        this.markers.push({
          id: payload[m].id,
          value: latLng(payload[m].latitude, payload[m].longitude),
          time: new Date(payload[m].timestamp).toLocaleString('cs-CZ'),
          speed: payload[m].speed + ' km/h',
          icon: payload[m].icon === undefined ? this.pointIcon : payload[m].icon
        })
        if (m !== '0') {
          this.totalDistance += this.markers[m].value.distanceTo(this.markers[m - 1].value)
        }
      }
    },
    fitPolyline: function () {
      this.bounds = latLngBounds(this.polylines[0].points)
    }
  }
}
</script>

<style lang="sass" scoped>
.map
  margin-left: 12px
</style>
