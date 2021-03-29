import axios from 'axios'
import { ApiException } from '@/api/api'

async function vehicleList (token) {
  const config = {
    headers: {
      authorization: token
    },
    params: {
      page: null,
      'page-size': null
    }
  }
  // const res = new Map()
  let res = []
  await axios.get('/vehicles', config).then(response => {
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

async function vehicleHistory (vehicleId, since, until, token) {
  const config = {
    headers: {
      authorization: token
    }
  }
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
  }, config).then(response => {
    res = response.data
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

export { vehicleList, vehicleHistory }
