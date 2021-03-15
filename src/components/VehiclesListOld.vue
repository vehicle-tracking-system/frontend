<template lang="pug">
  div
    v-text-field(
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
    )

    v-data-table(
      v-model="selectedVehicles"
      :headers="headers"
      :items="vehicles"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      :search="search"
      hide-default-footer
      item-key="name"
      show-select
      sort-by="name"
      @item-selected="vehicleToggle"
      @toggle-select-all="vehiclesToggle"
      @page-count="pageCount = $event"
    )
      template(v-slot:item.position="{ item }")
        div(v-if="item.valid" class="circle pulse green")
        div(v-else class="circle pulse red")

      template(v-slot:item.actions="{ item }")
        v-icon(
          small
          class="mr-3"
          @click="showVehicleHistory(item)"
        ) mdi-map-clock
        v-icon(
          small
          class="mr-2"
        ) mdi-information

    div(class="text-center pt-2")
      v-pagination(
        v-model="page"
        :page.sync="page"
        :length="pageCount"
      )
</template>

<script>

export default {
  name: 'VehiclesList',
  props: ['vehicles'],
  computed: {},
  data () {
    return {
      search: '',
      selectedVehicles: [], // selected vehicles in table
      pageCount: 1, // total # of table pages
      itemsPerPage: 10, // # items on each page of table
      page: 1,
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        {
          text: '',
          align: 'start',
          sortable: false,
          value: 'position'
        },
        {
          text: 'Actions',
          align: 'start',
          sortable: false,
          value: 'actions'
        }
      ]
    }
  },
  created: function () {
  },
  methods: {
    vehicleToggle (vehicle) {
      if (vehicle.value) {
        this.$emit('vehicleSelected', vehicle.item, false)
      } else {
        this.$emit('vehicleUnselected', vehicle.item, false)
      }
    },
    vehiclesToggle (vehicles) {
      if (vehicles.value) {
        this.$emit('allVehiclesSelected', vehicles.items, false)
      } else {
        this.$emit('allVehiclesUnelected', vehicles.items, false)
      }
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
