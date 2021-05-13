<template lang="pug">
  v-container(fluid)
    v-tour(name="historyTour" :steps="steps" :callbacks="callbacks")
    v-row(no-gutters justify="space-around")
      v-col(cols="12" md="3" xs="12" sm="12")
        v-menu(style="z-index:9999;" ref="menu" v-model="dialogMenu" :close-on-content-click='false' :return-value.sync="dates" transition='scale-transition' offset-y='' min-width='auto')
          template(v-slot:activator='{ on, attrs }')
            v-text-field(v-model="dateRangeText" label='Date' prepend-icon='mdi-calendar' readonly='' v-bind='attrs' v-on='on' )
            div(id="v-history-0")
          v-date-picker(
            color="primary"
            v-model="dates"
            :events="daysWithTrack"
            :picker-date.sync="monthInScope"
            range
            no-title
            @change="dateSelected" scrollable='')
        v-text-field(
          id="v-history-1"
          v-model="(totalDistance / 1000).toFixed(2)+ ' km'"
          label="Total distance"
          prepend-icon="mdi-map-marker-distance"
          readonly)
        v-data-table.elevation-1(
          id="v-history-2"
          dense
          :headers='tracksHeaders'
          :items="tracks"
          @click:row="loadTrack"
        )
          template(v-slot:item.actions="{ item }")
            v-icon(
              id="v-history-3"
              small
              class="mr-2"
              @click="downloadItem(item)"
            ) mdi-download

      v-col(cols="12" md="9" xs="12" sm="12")
        div(v-if="showMap" class="map")
          l-map(
            ref="mymap"
            style="height: 93vh"
            :zoom="zoom"
            :center="center"
            :bounds="bounds")
            l-tile-layer(:url="url")
            l-control
              v-chip
                v-switch(
                  v-model="waypointsSwitch"
                  flat
                  :label="`Waypoints`"
                ) Show waypoints
            l-control
              v-progress-circular(v-if="loadingTracks"
                class="text-center"
                indeterminate
                :size=70
                :width="7"
                color="primary"
              )
            l-layer-group(layer-type="overlay" name="route")
              l-polyline(
                v-for="item in polylines"
                :key="item.id"
                :lat-lngs="item.points"
                :visible="true"
              )
              l-marker(v-if="start" :lat-lng="start" :icon="start_icon")
              l-marker(v-if="end" :lat-lng="end" :icon="end_icon")
              l-circle-marker(v-if="waypointsSwitch" v-for="(marker, index) in markers" :key="marker.id" :lat-lng="marker.value" :radius="2" :icon="marker.icon")
                l-tooltip(:options="{ permanent: false, interactive: true }")
                  div {{ marker.time }}
                  div {{ marker.speed }}
                  div {{ marker.value.lat }} {{ marker.value.lng }}
            l-control(:position="'bottomright'" class="icons-credits")
              div Icons made by
                a(href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry") Kiranshastry from
                a(href="https://www.flaticon.com/" title="Flaticon")  www.flaticon.com
            l-control(
              :position="'bottomleft'"
              class="custom-control-watermark"
            ) Vehicle tracking system

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
  LTooltip,
  LControl,
  LCircleMarker
} from 'vue2-leaflet'
import { icon, latLng, latLngBounds } from 'leaflet'
import * as api from '@/api/vehicle'
import * as apiUtils from '@/api/api'
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
    LControlLayers,
    LControl,
    LCircleMarker
  },
  data () {
    return {
      showMap: true,
      tracksHeaders: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'track.date'
        },
        {
          text: 'Time',
          align: 'start',
          sortable: true,
          value: 'track.time'
        },
        {
          text: 'Actions',
          sortable: false,
          value: 'actions'
        }
      ],
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
      defaultPointIcon: icon({
        iconUrl: require('../assets/dot.svg'),
        iconSize: [13, 15],
        iconAnchor: [4, 7]
      }),
      emptyIcon: icon({
        iconUrl: require('../assets/dot.svg'),
        iconSize: [1, 1],
        iconAnchor: [4, 7]
      }),
      start: null,
      end: null,
      polylines: [],
      markers: [],
      points: [],
      dialogMenu: null,
      activeDates: [],
      monthInScope: null,
      dates: ['', ''],
      lastDates: ['', ''],
      vehicleId: null,
      totalDistance: 0,
      radius: 2,
      waypointsSwitch: false,
      loadingTracks: false,
      mapRef: null,
      tracks: [],
      steps: [
        {
          target: '#v-history-0',
          header: {
            title: 'Select range'
          },
          before: type => new Promise((resolve, reject) => {
            setTimeout(resolve, 250)
          }),
          content: 'Click here to select a day range to view vehicle history'
        },
        {
          target: '#v-history-1',
          header: {
            title: 'Range'
          },
          content: 'If you want to show current position, press this circle button.'
        },
        {
          target: '#v-history-2',
          header: {
            title: 'Tracks'
          },
          before: type => new Promise((resolve, reject) => {
            this.tracks.push({ track: { date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() } })
            resolve()
          }),
          content: 'If you click this map button, you will be redirect to page for browsing vehicle history.'
        },
        {
          target: '#v-history-3',
          header: {
            title: 'Download GPX'
          },
          params: {
            highlight: true
          },
          content: 'Here you can download GPX export of the track.'
        },
        {
          target: '#v-history-2',
          header: {
            title: 'End'
          },
          before: type => new Promise((resolve, reject) => {
            this.tracks = []
            resolve()
          }),
          content: 'You finish this tour. You can now enjoy this application.'
        }
      ]
    }
  },
  updated () {

  },
  mounted () {
    const map = this.$refs.mymap.mapObject
    map.addControl(new window.L.Control.Fullscreen())
    this.$nextTick(() => {
      if (this.isNew) {
        this.$tours.historyTour.start()
      }
    })
  },
  watch: {
    monthInScope (date) {
      const [year, month] = date.split('-')
      apiUtils.activeDates(this.vehicleId, month, year).then(days => {
        this.activeDates = days
      })
    }
  },
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
    isNew () {
      return this.$store.getters.showHistoryTour
    },
    callbacks () {
      return {
        onFinish: this.hideTour,
        onSkip: this.hideTour
      }
    }
  },
  created: async function () {
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
    async dateSelected () {
      this.loadingTracks = true
      api.vehicleHistory(this.vehicleId, this.dates[0], this.dates[1]).then(response => {
        this.loadingTracks = false
        this.dialogMenu = false
        const positions = response.positions
        const tracks = response.tracks
        if (positions.length === 0) {
          this.$snotify.warning('No data available for the selected date period:\n' + this.dateRangeText)
          return
        }
        this.polylines = [{
          id: 'route',
          points: positions.map(point => latLng(point.latitude, point.longitude)),
          visible: true
        }]
        this.start = latLng(positions[positions.length - 1].latitude, positions[positions.length - 1].longitude)
        this.end = latLng(positions[0].latitude, positions[0].longitude)
        this.addMarkers(positions)
        this.fitPolyline()
        tracks.map(t => {
          const date = Date.parse(t.track.timestamp)
          t.track.timestamp = new Date(date).toLocaleString('cs-CZ')
          t.track.date = new Date(date).toLocaleDateString('cs-CZ')
          t.track.time = new Date(date).toLocaleTimeString('cs-CZ')
        })
        this.tracks = tracks
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
          speed: payload[m].speed.toFixed(2) + ' km/h',
          icon: payload[m].icon === undefined ? null : payload[m].icon

        })
        if (m !== '0') {
          this.totalDistance += this.markers[m].value.distanceTo(this.markers[m - 1].value)
        }
      }
    },
    fitPolyline: function () {
      this.bounds = latLngBounds(this.polylines[0].points)
    },
    daysWithTrack (date) {
      const [, , day] = date.split('-')
      return this.activeDates.includes(parseInt(day, 10))
    },
    async loadTrack (track) {
      this.loadingTracks = true
      api.trackPositions(track.track.id).then(response => {
        console.log(response)
        this.loadingTracks = false
        const positions = response
        this.polylines = [{
          id: 'route',
          points: positions.map(point => latLng(point.latitude, point.longitude)),
          visible: true
        }]
        this.start = latLng(positions[positions.length - 1].latitude, positions[positions.length - 1].longitude)
        this.end = latLng(positions[0].latitude, positions[0].longitude)
        this.addMarkers(positions)
        this.fitPolyline()
      })
    },
    downloadItem (track) {
      console.log(track.track.id)
      axios({
        url: '/gpx',
        method: 'GET',
        responseType: 'blob',
        params: { id: track.track.id }
      }).then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')

        fileLink.href = fileURL
        fileLink.setAttribute('download', 'export.gpx')
        document.body.appendChild(fileLink)

        fileLink.click()
      })
    },
    hideTour () {
      this.$store.dispatch('HideHistoryTour')
    }
  }
}
</script>

<style lang="sass" scoped>
.map
  margin-left: 12px

.spinner
  padding-top: 50%
  padding-left: 50%
</style>
