const apiUrl = 'http://fauques.freeboxos.fr:3000'

export const login = async (username, password) => {
  const response = await fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ username, password })
  })

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  localStorage.setItem("username", username);
  localStorage.setItem("token", data.token);
}

export const logout = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("token");
}

export const fetchMatches = async () => {
  const response = await fetch(`${apiUrl}/matches`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data
}

export const fetchMatch = async (id) => {
  const response = await fetch(`${apiUrl}/matches/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data
}

export const postMatch = async () => {
  const response = await fetch(`${apiUrl}/matches`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data 

}