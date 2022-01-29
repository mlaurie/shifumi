import { EventSourcePolyfill } from 'event-source-polyfill';

import { setConnectedUser, unsetConnectedUser, getConnectedUser } from './storage'

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

  setConnectedUser({ username, token: data.token })
}

export const logout = () => {
  unsetConnectedUser()
}

export const fetchMatches = async () => {
  const connectedUser = getConnectedUser()
  const token = connectedUser?.token
  const response = await fetch(`${apiUrl}/matches`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data
}

export const fetchMatch = async (id) => {
  const connectedUser = getConnectedUser()
  const token = connectedUser?.token
  const response = await fetch(`${apiUrl}/matches/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data
}

export const postMatch = async () => {
  const connectedUser = getConnectedUser()
  const token = connectedUser?.token
  const response = await fetch(`${apiUrl}/matches`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data
}

export const fetchMatchEvents = (id) => {
  const connectedUser = getConnectedUser()
  const token = connectedUser?.token

  return new EventSourcePolyfill(`${apiUrl}/matches/${id}/subscribe`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}
