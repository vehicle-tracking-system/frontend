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

async function vehicleList (token) {
  const config = {
    headers: {
      authorization: token
    }
  }
  let res = null
  await axios.post('/vehicles', {}, config).then(response => {
    const payload = JSON.parse(response.data)
    res = payload.data.map(a => a.vehicle)
  }).catch(error => {
    if (error.response !== undefined) {
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

async function lastPosition (vehicle, token) {
  const config = {
    headers: {
      authorization: token
    }
  }
  return await axios.get('/vehicle/' + vehicle.id + '/position', config)
    .then(response => {
      console.log(response.data)
      const obj = JSON.parse(response.data)
      return new Position(obj.id, obj.latitude, obj.longitude, obj.speed, obj.timestamp, obj.trackId, obj.vehicleId)
    }).catch(error => {
      if (error.response !== undefined) {
        switch (error.response.status) {
          case 403:
            throw new ApiException('You don\'t have permissions to view vehicle positions history!', error.response.status)
          default:
            throw new ApiException('Unknown API error', error.response.status)
        }
      } else {
        throw new ApiException('Could not connect to server', -1)
      }
    })
}

// async function getAllTrackers (token) {
//   const config = {
//     headers: {
//       authorization: token
//     }
//   }
//
//   return await axios.get('/vehicle/' + vehicle.id + '/position', config)
//     .then(response => {
//       console.log(response.data)
//       const obj = JSON.parse(response.data)
//       return new Position(obj.id, obj.latitude, obj.longitude, obj.speed, obj.timestamp, obj.trackId, obj.vehicleId)
//     }).catch(error => {
//       if (error.response !== undefined) {
//         switch (error.response.status) {
//           case 403:
//             throw new ApiException('You don\'t have permissions to view vehicle positions history!', error.response.status)
//           default:
//             throw new ApiException('Unknown API error', error.response.status)
//         }
//       } else {
//         throw new ApiException('Could not connect to server', -1)
//       }
//     })
// }

export { vehicleList, lastPosition, ApiException, Position }
