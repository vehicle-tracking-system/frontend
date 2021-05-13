<template lang="pug">
  v-container(fluid)
    div(v-if="loading") Loading data from server. Please wait ....
    div(v-else-if="loadingErr") Fatal error occurred, try to refresh page ...
    v-row(v-else no-gutters)
      v-col(cols="12" md="3" xs="12" sm="12")
        div(class="text-center")
          v-progress-circular(
            v-if="vehiclesLoading"
            class="text-center"
            indeterminate
            :size=50
            color="primary")
        VList(
          v-if="!vehiclesLoading"
          :items="Array.from(vehicles.values())"
          :status="true"
          @filtered="forceRefresh"
          @selected="vehicleSelected"
          @unselected="vehicleUnselected"
          @selectedAll="allVehiclesSelected"
          @unselectedAll="allVehiclesUnselected"
        )
      v-col(cols="12" sm="12" md="9" xs="12" class="text-center")
        OwnMap(
          class="map"
          :markers="Array.from(markers.values())"
          :center="center"
        )
</template>

<script>
import OwnMap from '@/components/livevehicles/LiveMap'
import VList from '@/components/VehicleLiveList'
import { latLng } from 'leaflet'
import * as api from '@/api/api'

export default {
  name: 'Vehicles',
  components: {
    OwnMap,
    VList
  },
  beforeRouteLeave (to, from, next) {
    this.connection.close()
    this.connection = null
    next()
  },
  data () {
    return {
      loading: true,
      loadingErr: false,
      vehiclesLoading: true,
      isConnected: false,
      lastHeartBeat: null,
      reconnectTimer: null,
      center: latLng(49.7437572, 15.3386383),
      markers: new Map(),
      connection: null,
      test: new OwnMap.Position(1, 1, 1),
      vehicles: new Map()
    }
  },
  created: async function () {
    this.initWs().then(_ => {
      this.loading = false
    })

    this.reconnectTimer = setInterval(() => {
      if ((this.lastHeartBeat + 5000 < new Date().getTime()) && this.isConnected) {
        console.log('Missed heartbeat!')
        this.$snotify.error('Connection with server was lost', { timeout: 3000 })
        // this.initWs()
      }
    }, 6000)

    window.addEventListener('beforeunload', () => {
      console.log('Closing the page')
      this.connection.send('close')
    }, false)
  },
  computed: {},
  methods: {
    initWs: async function () {
      await this.loadVehicleList()
      if (this.loadingErr) return false
      this.connection = new WebSocket(process.env.VUE_APP_WS_BACKEND_URL)
      this.connection.onopen = () => {
        this.$snotify.success('Successfully connected to the server', { timeout: 3000 })
      }

      this.isConnected = true

      this.connection.onmessage = (msg) => {
        console.log(msg)
        this.receiveMessage(JSON.parse(msg.data))
      }
      clearInterval(this.reconnectTimer)

      return true
    },
    removeMarker: function (id) {
      this.markers.delete(id)
    },
    addMarker: function (payload) {
      console.log(this.vehicles)
      this.markers.set(payload.vehicleId, {
        id: payload.vehicleId,
        value: latLng(payload.latitude, payload.longitude),
        vehicleId: payload.vehicleId,
        vehicleName: this.vehicles.get(payload.vehicleId).vehicle.name,
        timestamp: payload.timestamp
      })
    },
    sendMessage: function (message) {
      this.connection.send(message)
    },
    receiveMessage: function (msg) {
      switch (msg.msgType) {
        case 'HEARTBEAT':
          this.lastHeartBeat = new Date().getTime()
          break
        case 'POSITION' : {
          const payload = JSON.parse(msg.payload)
          console.log(payload)
          this.vehicles.get(payload.vehicleId).valid = payload.isMoving
          this.vehicles.get(payload.vehicleId).position = payload
          this.removeMarker(payload.vehicleId)
          this.addMarker(payload)
          this.$forceUpdate()
        }
          break
        case 'ERROR' :
          this.$snotify.error(JSON.parse(msg.payload))
          break
      }
    },
    async loadVehicleList () {
      api.vehicleList(this.$store.getters.StateToken).then(r => {
        this.vehicles = r
        this.vehiclesLoading = false
      }).catch(err => {
        if (err.status === -1) this.loadingErr = true
        this.$snotify.error(err.message)
      })
    },
    vehicleSelected (vehicle, silent) {
      this.sendMessage(JSON.stringify({
        msgType: 'SUBSCRIBE_POSITIONS',
        token: this.$store.getters.StateToken,
        payload: vehicle.id.toString()
      }))
      this.findLastPosition(vehicle).catch(err => this.$snotify.error(err.message))
      if (!silent) this.$snotify.success('Live position of vehicle "' + vehicle.name + '" was subscribed.')
    },
    vehicleUnselected (vehicle, silent) {
      this.sendMessage(JSON.stringify({
        msgType: 'UNSUBSCRIBE_POSITIONS',
        token: this.$store.getters.StateToken,
        payload: vehicle.id.toString()
      }))
      this.removeMarker(vehicle.id)
      if (!silent) this.$snotify.warning('Live position of vehicle "' + vehicle.name + '" was unsubscribed.')
      this.$forceUpdate()
    },
    allVehiclesSelected (vehicles) {
      for (const v in vehicles) {
        this.vehicleSelected(vehicles[v], true)
      }
      this.$snotify.success('Live position was subscribed for all vehicles.')
    },
    allVehiclesUnselected (vehicles) {
      for (const v in vehicles) {
        this.vehicleUnselected(vehicles[v], true)
      }
      this.$snotify.warning('Live position was unsubscribed for all vehicles.')
    },
    focusVehicle (vehicle) {
      this.center = this.markers.find(v => v.id === vehicle.id).value
    },
    async findLastPosition (vehicle) {
      const payload = await api.lastPosition(vehicle, this.$store.getters.StateToken)
      this.addMarker(payload)
      this.vehicles.get(payload.vehicleId).position = payload
      this.$forceUpdate()
    },
    forceRefresh () {
      console.log('asdasd')
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped lang="sass">
.map
  margin-left: 12px
</style>
