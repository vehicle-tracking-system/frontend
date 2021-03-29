import axios from 'axios'
import { ApiException } from '@/api/api'

async function getAllTrackers (token) {
  const config = {
    headers: {
      authorization: token
    },
    params: {
      page: null,
      'page-size': null
    }
  }

  return await axios.get('/trackers', config)
    .then(response => {
      console.log(response.data.data)
      return response.data.data
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

async function newTracker (tracker, token) {
  const config = {
    headers: {
      authorization: token
    }
  }
  let res = null
  await axios.post('/tracker/new', tracker, config).then(response => {
    res = response.data
  }).catch(error => {
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to create new tracker!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

async function deleteTracker (tracker, token) {
  const config = {
    headers: {
      authorization: token
    }
  }
  let res = null
  await axios.post('/tracker/delete', tracker, config).then(response => {
    res = response.data
  }).catch(error => {
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to remove the tracker!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

async function updateTracker (tracker, token) {
  const config = {
    headers: {
      authorization: token
    }
  }
  let res = null
  await axios.post('/tracker', tracker, config).then(response => {
    res = response.data
  }).catch(error => {
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to update the tracker!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

async function revokeToken (tracker, token) {
  const config = {
    headers: {
      authorization: token
    }
  }
  let res = null
  await axios.post('/tracker/revoke', tracker, config).then(response => {
    res = response.data
  }).catch(error => {
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to revoke token!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

export { getAllTrackers, newTracker, deleteTracker, updateTracker, revokeToken }
