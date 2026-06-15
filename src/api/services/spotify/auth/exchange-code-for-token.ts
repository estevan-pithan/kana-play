import { z } from 'zod'
import axios from 'axios'

import { VITE_SPOTIFY_AUTH_URL, USE_SPOTIFY_MOCK } from '../api'
import { spotifyAuthConfig } from '@/utils/spotify-pkce'
import { exchangeCodeForTokenSuccessMock } from '@/api/mocks/spotify/auth/exchange-code-for-token.mock'

const exchangeCodeForTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  scope: z.string().optional(),
})

export type ExchangeCodeForTokenResponse = z.infer<typeof exchangeCodeForTokenResponseSchema>

export interface ExchangeCodeForTokenInput {
  code: string
  codeVerifier: string
}

export async function exchangeCodeForToken({
  code,
  codeVerifier,
}: ExchangeCodeForTokenInput): Promise<ExchangeCodeForTokenResponse> {
  if (USE_SPOTIFY_MOCK) return exchangeCodeForTokenSuccessMock

  const response = await axios.post(
    VITE_SPOTIFY_AUTH_URL,
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: spotifyAuthConfig.redirectUri,
      client_id: spotifyAuthConfig.clientId,
      code_verifier: codeVerifier,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  )

  return exchangeCodeForTokenResponseSchema.parse(response.data)
}
