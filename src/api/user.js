import request from '@/utils/request'

const urlBase = '/v1/user'

const urls = {
  login: urlBase + '/login',
  logout: urlBase + '/logout',
  getInfo: urlBase + '/me',
  register: urlBase + '/register'
}

export function login(email, password) {
  const formData = new FormData()
  formData.append('username', email)
  formData.append('password', password)
  return request({
    url: urls.login,
    method: 'post',
    data: formData
  })
}

export function register(email, password, username, type) {
  const data = {
    email: email,
    password: password,
    username: username,
    user_type: type
  }
  return request({
    url: urls.register,
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: urls.getInfo,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: urls.logout,
    method: 'post'
  })
}
