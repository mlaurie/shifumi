export const setConnectedUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user))
  localStorage.setItem("isAuthenticated", JSON.stringify("true"))
}

export const unsetConnectedUser = () => {
  localStorage.removeItem("user")
  localStorage.removeItem("isAuthenticated")
}

export const getConnectedUser = () => {
  return JSON.parse(localStorage.getItem("user"))
}
