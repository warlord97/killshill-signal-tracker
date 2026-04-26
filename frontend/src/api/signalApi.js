import axios from 'axios'
import { API_BASE_URL } from '../constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

export const getAllSignals = async () => {
  const { data } = await api.get('/api/signals')
  return data.data
}

export const getSignalById = async (id) => {
  const { data } = await api.get(`/api/signals/${id}`)
  return data.data
}

export const createSignal = async (payload) => {
  const { data } = await api.post('/api/signals', payload)
  return data.data
}

export const deleteSignal = async (id) => {
  await api.delete(`/api/signals/${id}`)
}

export const getLiveStatus = async (id) => {
  const { data } = await api.get(`/api/signals/${id}/status`)
  return data.data
}