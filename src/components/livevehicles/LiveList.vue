<template lang="pug">
  v-card(class='mx-auto' height="93vh")
    v-card-title(class="pa-0")
      v-toolbar.rounded-0(color='primary' dark fixed flat)
        v-btn(icon classs="mx-3" dark color="second" @click="toggleSelectAll" id="v-live-3")
          v-icon(v-if="selectedAll") mdi-checkbox-multiple-marked-circle
          v-icon(v-if="!selectedAll") mdi-checkbox-multiple-blank-circle-outline
        v-text-field(class="mx-3" flat label="Search" prepend-inner-icon="mdi-magnify" solo-inverted single-line hide-details v-model="search" clearable @click:clear="clearSearch")
    v-divider
    v-card-text
      v-list.rounded-0(two-line class='overflow-y-auto' flat)
        v-list-item-group(
          v-model="s"
          active-class="none"
          multiple
        )
          template(v-for='(vf, index) in filteredItems')
            LiveRow(
              :item="vf"
              :index="index"
              :isSelected="selected.includes(vf.vehicle.id)"
              :render="renderRows"
              @click="itemChanged"
              @history="showVehicleHistory"
            )
            v-divider(v-if='index + 1 < items.length')
</template>

<script>
import LiveRow from '@/components/livevehicles/LiveRow'

export default {
  name: 'LiveList',
  components: { LiveRow },
  props: ['items', 'fleets'],
  data () {
    return {
      selectedClass: 'lightBlue',
      search: '',
      selected: [],
      s: [],
      selectedAll: false,
      renderRows: true
    }
  },
  watch: {
    items: function () {
      this.renderRows = false
      this.$nextTick(() => {
        this.renderRows = true
      })
    }
  },
  computed: {
    filteredItems () {
      function compare (a, b) {
        if (a.name < b.name) {
          return -1
        }
        if (a.name > b.name) {
          return 1
        }
        return 0
      }

      return this.items.filter(item => {
        if (!this.search) return this.items
        return (item.vehicle.name.toLowerCase().includes(this.search.toLowerCase()))
      }).sort(compare)
    }
  },
  methods: {
    clearSearch () {
      this.search = ''
    },
    itemChanged (item) {
      if (this.selected.includes(item.vehicle.id)) {
        this.$emit('unselected', item.vehicle)
      } else {
        this.$emit('selected', item.vehicle)
      }
      console.log('Selected')
      console.log(item)
      if (this.selected.indexOf(item.vehicle.id) > -1) {
        this.selected = this.selected.filter(a => a !== item.vehicle.id)
      } else {
        this.selected.push(item.vehicle.id)
      }
      this.selectedAll = this.selected.length === this.items.length
    },
    toggleSelectAll () {
      if (this.selectedAll) {
        this.selected = []
        console.log('unselectedAll')
        this.$emit('unselectedAll', this.items.map(a => a.vehicle), false)
      } else {
        for (const i in this.items) {
          if (!this.selected.includes(this.items[i].vehicle.id)) {
            this.selected.push(this.items[i].vehicle.id)
          }
        }
        this.$emit('selectedAll', this.items.map(a => a.vehicle), false)
      }
      this.selectedAll = !this.selectedAll
    },
    showVehicleHistory (vehicle) {
      this.$router.push('/history?id=' + vehicle.vehicle.id)
    }
  }
}
</script>

<style scoped>
.v-card {
  display: flex !important;
  flex-direction: column;
}
.v-card__text {
  flex-grow: 1;
  overflow: auto;
}
</style>
