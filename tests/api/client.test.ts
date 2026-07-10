import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, createHttpClient } from '../../src/api/client'

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('createHttpClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('normalizes trailing slash on base URL', async () => {
    const client = createHttpClient('http://localhost:8000/')
    expect(client.baseUrl).toBe('http://localhost:8000')
  })

  it('sends Bearer token on authenticated requests', async () => {
    const client = createHttpClient('http://localhost:8000', 'secret-token')
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ id: 1, email: 'user@example.com' }))

    await client.getMe()

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer secret-token' }),
      }),
    )
  })

  it('posts register payload as JSON', async () => {
    const client = createHttpClient('http://localhost:8000')
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ id: 1, email: 'new@example.com' }))

    await client.register('new@example.com', 'password123')

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/auth/register',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ email: 'new@example.com', password: 'password123' }),
      }),
    )
  })

  it('posts login as form-urlencoded', async () => {
    const client = createHttpClient('http://localhost:8000')
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ access_token: 'abc', token_type: 'bearer' }))

    await client.login('user@example.com', 'secret')

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/auth/login',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        body: new URLSearchParams({ username: 'user@example.com', password: 'secret' }),
      }),
    )
  })

  it('builds item list query params', async () => {
    const client = createHttpClient('http://localhost:8000')
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ items: [], total: 0, skip: 5, limit: 10 }))

    await client.listItems({ skip: 5, limit: 10, category_id: 2, name_contains: 'widget' })

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/items?skip=5&limit=10&category_id=2&name_contains=widget',
      expect.any(Object),
    )
  })

  it('throws ApiError on non-OK responses', async () => {
    const client = createHttpClient('http://localhost:8000')
    vi.mocked(fetch).mockResolvedValueOnce(new Response('Unauthorized', { status: 401 }))

    const err = await client.getHealth().catch((e) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err).toMatchObject({ status: 401, body: 'Unauthorized' })
  })

  it('updates access token via setAccessToken', () => {
    const client = createHttpClient('http://localhost:8000')
    expect(client.accessToken).toBeNull()

    client.setAccessToken('new-token')
    expect(client.accessToken).toBe('new-token')
  })
})
