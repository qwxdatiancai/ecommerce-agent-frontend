
const storage = {
  setUseRoles(roles) {
    localStorage.setItem('useRoles', JSON.stringify(roles))
  },
  getUseRoles() {
    return JSON.parse(localStorage.getItem('useRoles'))
  }
}

export default storage
