<template lang="pug">
  div
    v-row(no-gutters)
      v-col(cols="12" md="4" xs="12" sm="12")
        div(class="text-center")
          v-progress-circular(
            v-if="vehiclesLoading"
            class="text-center"
            indeterminate
            :size=50
            color="primary")
        VList(
          v-if="!vehiclesLoading"
          :items="vehicles"
        )
      v-col(cols="12" offset-md="1" md="6" xs="12" sm="12")
        VList(
          v-if="!vehiclesLoading"
          :items="vehicles"
        )
</template>

<script>
import * as api from '@/api'
import VList from '@/components/VehiclesList'

export default {
  name: 'Trackers',
  components: {
    VList
  },
  data () {
    return {
      vehiclesLoading: true,
      vehicles: []
    }
  },
  created () {
    this.loadVehicleList()
  },
  methods: {
    async loadVehicleList () {
      api.vehicleList(this.$store.getters.StateToken).then(r => {
        this.vehicles = r
        this.vehiclesLoading = false
      }).catch(err => {
        if (err.status === -1) this.loadingErr = true
        this.$snotify.error(err.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
