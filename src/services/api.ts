
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://test.agweb.cloud/ServiceJSON',
})

let sessionId = localStorage.getItem('sessionId') || '';
let schemaId = localStorage.getItem('schemaId') || null;

export async function login(user: string = import.meta.env.API_USER, pass: string = import.meta.env.API_PASS): Promise<boolean> {
  try {
    const res = await api.post('/Login', {
      UserName: user,
      Password: pass,
    })

    if (res.data) {
      sessionId = res.data
      localStorage.setItem('sessionId', sessionId)

      const schemaRes = await api.post('/EnumSchemas', { session: sessionId })
      
      const schemas = schemaRes.data
      if (schemas && schemas.length > 0) {
        schemaId = schemas[0].ID
        localStorage.setItem('schemaId', schemaId!.toString())
        return true
      } else {
        return false
      }
    } else {
      throw new Error('Нет SessionId')
    }
  } catch (e) {
    console.error('Login error:', e)
    return false
  }
}

function checkSession() {
  if (!sessionId) throw new Error('Не аутентифицировано: отсутствует sessionId.');
  if (schemaId === null) throw new Error('Нет SchemaID');
}

export async function getDevices() {
  checkSession();
  const res = await api.post('/EnumDevices', { session: sessionId, schemaID: schemaId })
  return res.data
}

export async function getGeofences() {
  checkSession();
  const res = await api.post('/EnumGeoFences', { session: sessionId, schemaID: schemaId })
  return res.data
}

export async function getTrack(deviceId: number) {
  checkSession()
  const now = new Date()
  const yyyy = now.getFullYear()
  const MM = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')

  const from = `${yyyy}${MM}${dd}-0000`;
  
  const to = `${yyyy}${MM}${dd}-2359`;
  
  const res = await api.post('/GetTrack', {
    session: sessionId,
    schemaID: schemaId,
    IDs: deviceId,
    SD: from,
    ED: to
  })
  return res.data
}

export async function getGeofenceCoords(geoId: number) {
  checkSession();
  const res = await api.post('/GetGeofences', {
    session: sessionId,
    schemaID: schemaId,
    IDs: geoId
  })
  return res.data
}
