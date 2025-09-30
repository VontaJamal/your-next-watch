const API_URL = process.env.NEXT_PUBLIC_API_URL

let cachedToken: string | null = null

export async function getAuthToken(forceRefresh = false) {
  if (cachedToken && !forceRefresh) {
    return cachedToken
  }

  const response = await fetch(`${API_URL}/auth/token`)

  if (!response.ok) {
    throw new Error(`Failed to get auth token: ${response.status}`)
  }

  const data = await response.json()
  cachedToken = data.token
  return data.token
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
) {
  const token = await getAuthToken()

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  const response = await fetch(
    url.startsWith('http') ? url : `${API_URL}${url}`,
    {
      ...options,
      headers,
    },
  )

  if (response.status === 401) {
    const newToken = await getAuthToken(true)

    const retryHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${newToken}`,
      ...options.headers,
    }

    return fetch(url.startsWith('http') ? url : `${API_URL}${url}`, {
      ...options,
      headers: retryHeaders,
    })
  }

  return response
}
