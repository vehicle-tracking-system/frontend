import axios from 'axios'

function ApiException (message, status) {
  this.message = message
  this.status = status
}

function Position (id, latitude, longitude, speed, timestamp, trackId, vehicleId) {
  this.id = id
  this.latitude = latitude
  this.longitude = longitude
  this.speed = speed
  this.timestamp = timestamp
  this.trackId = trackId
  this.vehicleId = vehicleId
}

async function vehicleList () {
  const config = {
    params: {
      page: null,
      'page-size': null
    }
  }
  const res = new Map()
  await axios.get('/vehicle/list', config).then(response => {
    const payload = response.data
    payload.data.forEach(a => res.set(a.vehicle.id, a))
    // payload.data.forEach(a => res.set(a.vehicle.id, a.vehicle))
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

async function lastPosition (vehicle) {
  const config = {
    params: {
      id: vehicle.id
    }
  }
  return await axios.get('/vehicle/position', config)
    .then(response => {
      const obj = response.data
      return new Position(obj.id, obj.latitude, obj.longitude, obj.speed, obj.timestamp, obj.trackId, obj.vehicleId)
    }).catch(error => {
      if (error.response !== undefined) {
        switch (error.response.status) {
          case 403:
            throw new ApiException('You don\'t have permissions to view vehicle positions history!', error.response.status)
          case 404:
            throw new ApiException('No positions found.', error.response.status)
          default:
            throw new ApiException('Unknown API error', error.response.status)
        }
      } else {
        throw new ApiException('Could not connect to server', -1)
      }
    })
}

async function activeDates (vehicleId, month, year) {
  const config = {
    params: {
      id: vehicleId,
      month: month,
      year: year
    }
  }
  let res = []
  await axios.get('/vehicle/active', config).then(response => {
    res = response.data
  }).catch(error => {
    console.log(error)
  })
  return res
}

export { ApiException, Position, vehicleList, lastPosition, activeDates }
