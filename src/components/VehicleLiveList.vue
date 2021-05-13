<template lang="pug">
  v-card(class='mx-auto')
    v-toolbar(color='primary' dark)
      v-btn(icon classs="mx-3" dark color="second" @click="toggleSelectAll")
        v-icon(v-if="selectedAll") mdi-checkbox-multiple-marked-circle
        v-icon(v-if="!selectedAll") mdi-checkbox-multiple-blank-circle-outline
      v-text-field(class="mx-3" flat label="Search" prepend-inner-icon="mdi-magnify" solo-inverted single-line hide-details v-model="search" clearable @click:clear="clearSearch")
    v-list(two-line class='overflow-y-auto' style="max-height: 80vh;" flat)
      v-list-item-group(
        v-model="s"
        active-class="none"
        multiple
      )
        template(v-for='(item, index) in filteredItems ')
          v-list-item(:key='item.vehicle.id' ripple :value="item.vehicle.id" :class="{ 'lightBlue' : selected.includes(item.vehicle.id) }" @click="itemChanged(item, index)")
            v-list-item-content
              v-list-item-title
                v-row(class="mx-auto pa-2" align="center")
                  v-btn(icon classs="mx-2" dark color="second")
                    v-icon(v-if="!selected.includes(item.vehicle.id)") mdi-checkbox-blank-circle-outline
                    v-icon(v-if="selected.includes(item.vehicle.id)") mdi-checkbox-marked-circle
                  div {{ item.vehicle.name }}

              v-list-item-subtitle(v-if="selected.includes(item.vehicle.id) && item.position" class="text--primary") {{ item.position.latitude }} {{ item.position.longitude }}
              v-list-item-subtitle(v-if="selected.includes(item.vehicle.id) && item.position") {{ item.position.speed.toFixed(1) }} km/h
              v-chip-group(column)
                v-chip(v-for="r in item.fleets" :key="r.id") {{ r.name }}
            v-list-item-action(align="center" class="text-center")
              v-icon(
                small
                class="mr-3"
                @click="showVehicleHistory(item)"
              ) mdi-map-clock
              v-icon(
                small
                class="mr-3"
                @click="showVehicleHistory(item)"
              ) mdi-clipboard-list-outline
            div(v-if="status && selected.includes(item.vehicle.id)")
              div(v-if="!item.valid" class="circle pulse red")
          v-divider(v-if='index + 1 < items.length' :key='item.index')
</template>

<script>
export default {
  props: ['items', 'status'],
  name: 'Trackers',
  data () {
    return {
      selectedClass: 'lightBlue',
      search: '',
      selected: [],
      s: [],
      selectedAll: false
    }
  },
  created () {
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

      if (this.selected.indexOf(item.vehicle.id) > -1) {
        this.selected = this.selected.filter(a => a !== item.vehicle.id)
      } else {
        this.selected.push(item.vehicle.id)
      }

      if (this.selected.length === this.items.length) {
        this.selectedAll = true
      } else {
        this.selectedAll = false
      }
    },
    toggleSelectAll (value) {
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
.lightBlue {
  color: #66FF99;
  background: rgba(36, 44, 69, 0.4);
}

.green {
  background: #66FF99;
}

.red {
  background: rgb(175, 27, 27);
}

.blue {
  background: #3652D9;
}

.rose {
  background: #FF66CC;
}

.center {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100vh;
}

.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0px 0px 1px 1px #0000001a;
}

.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px rgba(255, 255, 255, 0.5);
  }
  100% {
    box-shadow: 0 0 0 12px rgba(0, 0, 0, 0);
  }
}

.master {
  color: black;
  float: right;
}

@media (max-width: 900px) {
  .master {
    display: none
  }
}
</style>
