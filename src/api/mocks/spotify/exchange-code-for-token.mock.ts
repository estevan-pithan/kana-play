import type { ExchangeCodeForTokenResponse } from '@/api/services/spotify/exchange-code-for-token'

export const exchangeCodeForTokenSuccessMock: ExchangeCodeForTokenResponse = {
  access_token: 'BQDj0H9f3k8xU2WqYvNmR7pL1sTfC6gK4hD8eA2bX',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'AQDk1I0g4l9yV3XrZwOnS8qM2tUgD7hL5iE9fB3cY',
  scope: 'user-read-email user-read-private user-top-read user-library-read',
}

export const exchangeCodeForTokenEmptyMock: ExchangeCodeForTokenResponse = {
  access_token: '',
  token_type: '',
  expires_in: 0,
}

export const exchangeCodeForTokenErrorMock = {
  error: 'invalid_grant',
  error_description: 'Invalid authorization code',
}
