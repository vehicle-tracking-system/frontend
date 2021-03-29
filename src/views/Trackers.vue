<template lang="pug">
  div
    div(class="text-center")
    TrackerList(
      v-if="!trackersLoading"
      :items="trackers"
      :vehicles="vehicles"
      @newTracker="persistTracker"
      @deleteTracker="deleteTracker"
      @updateTracker="updateTracker"
      @revokeToken="revokeToken"
    )
      v-progress-circular(
        v-if="trackersLoading"
        class="text-center"
        indeterminate
        :size=50
        color="primary"
      )
</template>

<script>
import * as api from '@/api/tracker'
import * as vehicleApi from '@/api/vehicle'
import TrackerList from '@/components/TrackerList'

export default {
  name: 'Trackers',
  components: {
    TrackerList
  },
  data () {
    return {
      trackersLoading: true,
      vehiclesLoading: true,
      trackers: [],
      vehicles: []
    }
  },
  created () {
    this.loadTrackerList()
    this.loadVehicleList()
  },
  methods: {
    async loadTrackerList () {
      api.getAllTrackers(this.$store.getters.StateToken).then(r => {
        this.trackers = r
        this.trackersLoading = false
      }).catch(err => {
        if (err.status === -1) this.loadingErr = true
        this.$snotify.error(err.message)
      })
    },
    async loadVehicleList () {
      vehicleApi.vehicleList(this.$store.getters.StateToken).then(r => {
        this.vehicles = r
        this.vehiclesLoading = false
      }).catch(err => {
        if (err.status === -1) this.loadingErr = true
        this.$snotify.error(err.message)
      })
    },
    async persistTracker (tracker) {
      api.newTracker(tracker, this.$store.getters.StateToken).then(r => {
        this.trackers.push(r)
      }).catch(e => {
        this.$snotify.error('Creating tracker error: ' + e.toString())
        console.error(e)
      })
    },
    async updateTracker (tracker, index) {
      api.updateTracker(tracker, this.$store.getters.StateToken).then(updated => {
        Object.assign(this.trackers[index], updated)
        this.$snotify.success('Tracker ' + tracker.name + ' successfully updated.')
      }).catch(e => {
        this.$snotify.error('Updating tracker error: ' + e.toString())
        console.error(e)
      })
    },
    async deleteTracker (tracker, index) {
      api.deleteTracker(tracker, this.$store.getters.StateToken).then(_ => {
        this.$snotify.success('Tracker ' + tracker.name + ' successfully deleted.')
      }).catch(e => {
        this.$snotify.error('Updating tracker error: ' + e.toString())
        console.error(e)
      })
    },
    async revokeToken (tracker, index) {
      api.revokeToken(tracker, this.$store.getters.StateToken).then(updated => {
        console.log(index)
        Object.assign(this.trackers[index], updated)
        this.$snotify.success(tracker.name + ' token successfully revoked.')
      }).catch(e => {
        this.$snotify.error('Updating tracker error: ' + e.toString())
        console.error(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
