import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockClient } from '../../src/api/mock'

async function runWithMockDelay<T>(promise: Promise<T>) {
  await vi.advanceTimersByTimeAsync(200)
  return promise
}

describe('createMockClient', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns seeded categories and items', async () => {
    const client = createMockClient()

    const categories = await runWithMockDelay(client.listCategories())
    const items = await runWithMockDelay(client.listItems())

    expect(categories.total).toBeGreaterThanOrEqual(2)
    expect(categories.items.some((c) => c.name === 'Tools')).toBe(true)
    expect(items.total).toBeGreaterThanOrEqual(3)
    expect(items.items.some((i) => i.name === 'Widget')).toBe(true)
  })

  it('filters items by category and name', async () => {
    const client = createMockClient()

    const tools = await runWithMockDelay(client.listItems({ category_id: 1 }))
    const widget = await runWithMockDelay(client.listItems({ name_contains: 'widget' }))

    expect(tools.items.every((i) => i.category_id === 1)).toBe(true)
    expect(widget.items).toHaveLength(1)
    expect(widget.items[0].name).toBe('Widget')
  })

  it('supports auth register and me', async () => {
    const client = createMockClient()
    client.setAccessToken(null)

    const user = await runWithMockDelay(client.register('learner@example.com', 'password'))
    const me = await runWithMockDelay(client.getMe())

    expect(user.email).toBe('learner@example.com')
    expect(me.email).toBe('learner@example.com')
    expect(client.accessToken).toBe('mock-token')
  })

  it('creates and deletes a category', async () => {
    const client = createMockClient()
    const before = await runWithMockDelay(client.listCategories())

    const created = await runWithMockDelay(client.createCategory({ name: 'Test Cat', description: 'CI' }))
    const afterCreate = await runWithMockDelay(client.listCategories())

    await runWithMockDelay(client.deleteCategory(created.id))
    const afterDelete = await runWithMockDelay(client.listCategories())

    expect(created.name).toBe('Test Cat')
    expect(afterCreate.total).toBe(before.total + 1)
    expect(afterDelete.total).toBe(before.total)
  })

  it('returns item stats summary', async () => {
    const client = createMockClient()
    const stats = await runWithMockDelay(client.getItemStats())

    expect(stats.total_items).toBeGreaterThanOrEqual(3)
    expect(stats.min_price).not.toBeNull()
    expect(stats.max_price).not.toBeNull()
    expect(stats.by_category.length).toBeGreaterThan(0)
  })
})
