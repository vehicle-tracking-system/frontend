<template lang="pug">
  v-card(class='mx-auto')
    v-toolbar(color='primary' dark)
      v-btn(icon classs="mx-3" dark color="second" @click="toggleSelectAll")
        v-icon(v-if="selectedAll") mdi-checkbox-multiple-marked-circle
        v-icon(v-if="!selectedAll") mdi-checkbox-multiple-blank-circle-outline
      v-text-field(class="mx-3" flat label="Search" prepend-inner-icon="mdi-magnify" solo-inverted single-line hide-details v-model="search" clearable @click:clear="clearSearch")
    v-list(two-line class='overflow-y-auto' style="max-height: 80vh;")
      v-list-item-group(
        v-model="selected"
        active-class="primary--text"
        multiple
      )
        template(v-for='(item, index) in filteredItems')
          v-list-item(:key='item.id' ripple @click="itemChanged(item, index)" :value="item.id")
            template(v-slot:default="{ active }")
              v-list-item-content
                v-list-item-title {{ item.name }}
                v-list-item-subtitle(v-if="item.position && active" class="text--primary") {{ item.position.latitude }} {{ item.position.longitude }}
              v-list-item-content
                div(v-if="item.position") {{ item.position.speed }} km/h
              div
                v-icon(
                  small
                  class="mr-3"
                  @click="showVehicleHistory(item)"
                ) mdi-map-clock
                v-icon(
                  small
                  class="mr-2"
                  @click="showVehicleHistory(item)"
                ) mdi-information
              v-list-item-action(v-if="status")
                v-list-item-action-text
                  div(v-if="item.valid" class="circle pulse green")
                  div(v-else class="circle pulse red")
          v-divider(v-if='index + 1 < items.length' :key='item.index')

</template>

<script>
export default {
  props: ['items', 'status'],
  name: 'Trackers',
  data () {
    return {
      search: '',
      selected: [],
      selectedAll: false
    }
  },
  watch: {
    selected: function (newSelection) {
      this.$emit('newSelection', newSelection, false)
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
        return (item.name.toLowerCase().includes(this.search.toLowerCase()))
      }).sort(compare)
    }
  },
  methods: {
    clearSearch () {
      this.search = ''
    },
    itemChanged (item) {
      if (this.selected.includes(item.id)) {
        this.$emit('unselected', item)
      } else {
        this.$emit('selected', item)
      }
    },
    toggleSelectAll (value) {
      if (this.selectedAll) {
        this.selected = []
        console.log('unselectedAll')
        this.$emit('unselectedAll', this.items, false)
      } else {
        for (const i in this.items) {
          this.selected.push(this.items[i].id)
        }
        this.$emit('selectedAll', this.items, false)
      }
      this.selectedAll = !this.selectedAll
    },
    showVehicleHistory (vehicle) {
      this.$router.push('/history?id=' + vehicle.id)
    }
  }
}
</script>

<style scoped>
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
