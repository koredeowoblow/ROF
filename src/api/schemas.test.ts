import { describe, it, expect } from 'vitest'
import { ProductSchema, CustomerInfoSchema, OrderSchema } from './types'
import { initialProducts } from './products'
import { initialOrders } from './mockData'

describe('Data Contracts and Zod Schemas', () => {
  it('validates all five initial products against ProductSchema', () => {
    expect(initialProducts.length).toBe(5)
    initialProducts.forEach((product) => {
      const result = ProductSchema.safeParse(product)
      expect(result.success).toBe(true)
    })
  })

  it('validates customer contact coordinates correctly', () => {
    const validCustomer = {
      name: 'Olumide Adeleke',
      phone: '+234 803 123 4567',
      email: 'olumide@example.ng',
      address: '12 Marina Street',
      city: 'Lagos Island',
      state: 'Lagos',
    }
    expect(CustomerInfoSchema.safeParse(validCustomer).success).toBe(true)

    // Missing email or invalid
    const invalidEmail = { ...validCustomer, email: 'not-an-email' }
    expect(CustomerInfoSchema.safeParse(invalidEmail).success).toBe(false)

    // Name too short
    const shortName = { ...validCustomer, name: 'A' }
    expect(CustomerInfoSchema.safeParse(shortName).success).toBe(false)
  })

  it('validates seeded orders against OrderSchema', () => {
    initialOrders.slice(0, 5).forEach((order) => {
      const result = OrderSchema.safeParse(order)
      expect(result.success).toBe(true)
    })
  })
})

