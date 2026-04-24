import { login, logout, getInfo, register } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import storage from '@/utils/storage'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {
      id: 0,
      email: '',
      user_type: -1,
      username: ''
    },
    roles: storage.getUseRoles()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_ROLES: (state, roles) => {
    storage.setUseRoles(roles)
    state.roles = roles
  }
}

const actions = {
  // 登录
  login({ commit, state, dispatch }, data) {
    return new Promise((resolve, reject) => {
      const { email, password } = data
      login(email, password).then(response => {
        const data = response.data
        const authorization = 'Bearer ' + data.access_token
        commit('SET_TOKEN', authorization)
        commit('SET_USER_INFO', data)
        commit('SET_ROLES', [data.user_type])
        setToken(authorization)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户信息
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const data = response.data
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        commit('SET_USER_INFO', data)
        commit('SET_ROLES', [data.user_type])
        commit('permission/SET_ROUTES', [data.user_type])
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 用户注册
  register({ commit }, data) {
    const { email, password, username, user_type } = data
    return new Promise((resolve, reject) => {
      register(email, password, username, user_type).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 用户登出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken()
        resetRouter()
        commit('RESET_STATE')
        commit('SET_ROLES', [])
        resolve()
        location.reload()
      }).catch(error => {
        removeToken()
        resetRouter()
        commit('RESET_STATE')
        commit('SET_ROLES', [])
        reject(error)
      })
    })
  }
}

export default {
  namespaced: false,
  state,
  mutations,
  actions
}
