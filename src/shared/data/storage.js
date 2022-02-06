export const setConnectedUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user))
}

export const unsetConnectedUser = () => {
  localStorage.removeItem("user")
}

export const getConnectedUser = () => {
  return JSON.parse(localStorage.getItem("user"))
}
