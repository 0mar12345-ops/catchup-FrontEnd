import { http } from './http'

export interface OAuthStatus {
  status: 'valid' | 'invalid' | 'not_found'
  has_oauth: boolean
  needs_reauth: boolean
  granted_at?: string
  scopes_count?: number
  message?: string
}

export interface ReauthorizeResponse {
  auth_url: string
}

export async function getOAuthStatus() {
  const { data } = await http.get<OAuthStatus>('/users/oauth/status')
  return data
}

export async function getReauthorizeURL() {
  const { data } = await http.get<ReauthorizeResponse>('/users/oauth/reauthorize')
  return data
}
