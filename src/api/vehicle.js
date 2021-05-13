import axios from 'axios'
import { ApiException } from '@/api/api'

async function vehicleList () {
  const config = {
    params: {
      page: null,
      'page-size': null
    }
  }
  let res = []
  await axios.get('/vehicle/list', config).then(response => {
    const payload = response.data
    console.log(payload)
    res = payload.data.map(a => a.vehicle)
  }).catch(error => {
    console.log(error)
    if (error.response !== undefined) {
      console.log(error.response)
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to view list of vehicles and their actual positions!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

async function vehicleFleetList () {
  const config = {
    params: {
      page: null,
      'page-size': null
    }
  }
  let res = []
  await axios.get('/vehicle/list', config).then(response => {
    const payload = response.data
    console.log(payload)
    res = payload.data
  }).catch(error => {
    console.log(error)
    if (error.response !== undefined) {
      console.log(error.response)
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to view list of vehicles and their actual positions!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

async function vehicleHistory (vehicleId, since, until) {
  let s = new Date(since)
  let u = new Date(until)
  // sort dates - lower first
  if (s > u) {
    const tmp = u
    u = s
    s = tmp
  }
  let res = []
  u.setHours(23, 59, 59, 999)
  await axios.post('/vehicle/history', {
    vehicleId: vehicleId,
    since: s.toISOString(),
    until: u.toISOString()
  }).then(response => {
    res = response.data
    console.log('Response')
    console.log(response)
  }).catch(error => {
    console.log(error)
    if (error.response !== undefined) {
      console.log(error.response)
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to view history of vehicle!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

async function newVehicle (vehicle) {
  const payload = {
    name: vehicle.vehicle.name,
    fleets: vehicle.fleets
  }
  console.log(payload)
  let res = null
  await axios.post('/vehicle/new', payload).then(response => {
    res = response.data
  }).catch(error => {
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to create new vehicle!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

async function updateVehicle (vehicle) {
  console.log(vehicle)
  let res = null
  await axios.put('/vehicle', { data: vehicle }).then(response => {
    res = response.data
    console.log(res)
  }).catch(error => {
    console.error(error)
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to update the vehicle!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

async function trackPositions (trackId) {
  const config = {
    params: {
      id: trackId
    }
  }
  console.log(trackId)
  let res = []
  await axios.get('/track/positions', config).then(response => {
    res = response.data
  }).catch(error => {
    console.log(error)
    if (error.response !== undefined) {
      console.log(error.response)
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to view track!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

async function deleteVehicle (vehicleId) {
  const config = {
    params: {
      id: vehicleId
    }
  }
  console.log('Deleting vehicle')
  console.log(vehicleId)
  let res = []
  await axios.delete('/vehicle', config).then(response => {
    res = response.data
  }).catch(error => {
    console.log(error)
    if (error.response !== undefined) {
      console.log(error.response)
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to delete vehicle!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

export { vehicleList, vehicleHistory, newVehicle, updateVehicle, vehicleFleetList, trackPositions, deleteVehicle }
