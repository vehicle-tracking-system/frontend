import axios from 'axios'
import { ApiException } from '@/api/api'

async function getAllUsers () {
  const config = {
    params: {
      page: null,
      'page-size': null
    }
  }

  let res = []
  await axios.get('/user/list', config).then(response => {
    const payload = response.data
    res = payload.data
  }).catch(error => {
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to view list of users!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

async function editUser (user) {
  let res = null
  await axios.put('/user', user).then(response => {
    res = response.data
  }).catch(error => {
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to modify users!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

async function newUser (user) {
  let res = null
  await axios.post('/user/new', user).then(response => {
    res = response.data
  }).catch(error => {
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to create new user!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

async function deleteUser (user) {
  console.log(user)
  const config = {
    params: {
      id: user.id
    }
  }
  return await axios.delete('/user', config)
    .then(response => {
      const payload = response.data
      return payload
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

async function changePassword (userId, password) {
  const config = {
    params: {
      id: userId
    }
  }

  let res = null
  await axios.put('/user/pass', { password: password }, config).then(response => {
    res = response.data
  }).catch(error => {
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to modify users!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

async function changeYoursPassword (password) {
  let res = null
  await axios.put('/auth', { password: password }).then(response => {
    res = response.data
  }).catch(error => {
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 403:
          throw new ApiException('You don\'t have permissions to change your password!', error.response.status)
        default:
          throw new ApiException('Unknown API error', error.response.status)
      }
    } else {
      throw new ApiException('Could not connect to server', -1)
    }
  })
  return res
}

export { getAllUsers, editUser, newUser, deleteUser, changePassword, changeYoursPassword }
