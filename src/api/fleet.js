import axios from 'axios'
import { ApiException } from '@/api/api'

async function fleetList () {
  const config = {
    params: {
      page: null,
      'page-size': null
    }
  }
  let res = []
  await axios.get('/fleet/list', config).then(response => {
    res = response.data.data
  }).catch(error => {
    console.log(error)
    if (error.response !== undefined) {
      console.log(error.response)
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to view list fleets!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

async function newFleet (fleet) {
  let res = null
  await axios.post('/fleet/new', fleet).then(response => {
    console.log(response)
    res = response.data
  }).catch(error => {
    console.log(error)
    if (error.response !== undefined) {
      console.log(error.response)
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to view list fleets!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })

  return res
}

export { fleetList, newFleet }
