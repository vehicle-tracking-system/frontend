<template lang="pug">
  div
    div(class="text-center")
    VehicleList(
      v-if="!vehiclesLoading"
      :items="vehicles"
      :fleets="fleets"
      @newVehicle="persistVehicle"
      @deleteVehicle="deleteVehicle"
      @updateVehicle="updateVehicle"
      @newFleet="newFleet"
    )
      v-progress-circular(
        v-if="vehiclesLoading"
        class="text-center"
        indeterminate
        :size=50
        color="primary"
      )
</template>

<script>
import * as api from '@/api/vehicle'
import * as fleetApi from '@/api/fleet'
import VehicleList from '@/components/vehicles/VehicleList'

export default {
  name: 'Vehicles',
  components: {
    VehicleList
  },
  data () {
    return {
      vehiclesLoading: true,
      vehicles: [],
      fleets: []
    }
  },
  created () {
    this.loadVehicleList()
    this.loadFleetList()
  },
  methods: {
    async loadVehicleList () {
      api.vehicleFleetList().then(r => {
        this.vehicles = r
        this.vehiclesLoading = false
      }).catch(err => {
        if (err.status === -1) this.loadingErr = true
        this.$snotify.error(err.message)
      })
    },
    async loadFleetList () {
      fleetApi.fleetList().then(r => {
        this.fleets = r.map(f => f.fleet)
      }).catch(err => {
        if (err.status === -1) this.loadingErr = true
        this.$snotify.error(err.message)
      })
    },
    async persistVehicle (vehicle) {
      console.log(vehicle)
      api.newVehicle(vehicle).then(r => {
        console.log(r)
        this.vehicles.push(r)
        this.$snotify.success('Vehicle ' + vehicle.vehicle.name + ' successfully updated.')
      }).catch(e => {
        this.$snotify.error('Creating vehicle error: ' + e.toString())
        console.error(e)
      })
    },
    async updateVehicle (vehicle, index) {
      console.log(vehicle)
      api.updateVehicle(vehicle).then(updated => {
        Object.assign(this.vehicles[index], updated)
        this.$snotify.success('Vehicle ' + vehicle.vehicle.name + ' successfully updated.')
      }).catch(e => {
        this.$snotify.error('Updating vehicle error: ' + e.toString())
        console.error(e)
      })
    },
    async newFleet (fleetName) {
      fleetApi.newFleet({ name: fleetName }).then(updated => {
        console.log(updated)
        this.fleets.push(updated.fleet)
        this.$snotify.success('Fleet ' + updated.name + ' successfully updated.')
      }).catch(e => {
        this.$snotify.error('Updating vehicle error: ' + e.toString())
        console.error(e)
      })
    },
    async deleteVehicle (vehicle, index) {
      api.deleteVehicle(vehicle.id).then(_ => {
        this.vehicles.splice(index, 1)
        this.$snotify.success('Vehicle ' + vehicle.name + ' successfully deleted.')
      }).catch(e => {
        this.$snotify.error('Deleting vehicle error: ' + e.toString())
        console.error(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
