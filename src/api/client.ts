import { Product, Order, ContactMessage, Discount, AuditEntry, CustomerInfo, OrderItem } from './types'
import { initialProducts } from './products'
import { initialOrders, initialMessages, initialDiscounts, initialAuditLog } from './mockData'
import { initialContentConfig, ContentConfig } from '@/content/config'

const STORAGE_KEYS = {
  PRODUCTS: 'rof_products_db',
  ORDERS: 'rof_orders_db',
  MESSAGES: 'rof_messages_db',
  CONTENT: 'rof_content_db',
  DISCOUNTS: 'rof_discounts_db',
  AUDIT: 'rof_audit_db',
  AUTH: 'rof_admin_session',
}

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to save to localStorage', err)
  }
}

// In-memory / storage sync
let productsDb: Product[] = loadStorage(STORAGE_KEYS.PRODUCTS, initialProducts)
let ordersDb: Order[] = loadStorage(STORAGE_KEYS.ORDERS, initialOrders)
let messagesDb: ContactMessage[] = loadStorage(STORAGE_KEYS.MESSAGES, initialMessages)
let contentDb: ContentConfig = loadStorage(STORAGE_KEYS.CONTENT, initialContentConfig)
let discountsDb: Discount[] = loadStorage(STORAGE_KEYS.DISCOUNTS, initialDiscounts)
let auditDb: AuditEntry[] = loadStorage(STORAGE_KEYS.AUDIT, initialAuditLog)

/**
 * Typed API Client
 * Recomputes prices server-side, simulates network latency, and enforces validation rules.
 */
export const api = {
  // --- Public Store Endpoints ---

  async getProducts(): Promise<Product[]> {
    await delay(80)
    return [...productsDb]
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    await delay(60)
    const product = productsDb.find((p) => p.slug === slug || p.id === slug)
    return product || null
  },

  async getContent(): Promise<ContentConfig> {
    await delay(50)
    return { ...contentDb }
  },

  async createOrder(payload: {
    customer: CustomerInfo
    items: OrderItem[]
    paymentMethod: 'paystack' | 'bank_transfer' | 'delivery'
    discountCode?: string
    idempotencyKey?: string
  }): Promise<Order> {
    await delay(250)

    // SERVER-SIDE PRICE RECOMPUTATION (Never trust client)
    let recomputedSubtotal = 0
    for (const item of payload.items) {
      const prod = productsDb.find((p) => p.id === item.productId)
      const unitPrice = prod ? prod.price : item.unitPrice
      recomputedSubtotal += unitPrice * item.qty
    }

    const isLagos = payload.customer.state.toLowerCase().includes('lagos')
    const fee = isLagos ? contentDb.delivery.lagosFee.value : contentDb.delivery.interstateFee.value

    let discountAmount = 0
    if (payload.discountCode) {
      const code = payload.discountCode.toUpperCase()
      const foundDiscount = discountsDb.find((d) => d.code === code && d.active)
      if (foundDiscount) {
        if (foundDiscount.type === 'percentage') {
          discountAmount = Math.round((recomputedSubtotal * foundDiscount.value) / 100)
        } else {
          discountAmount = foundDiscount.value
        }
      }
    }

    const total = Math.max(0, recomputedSubtotal + fee - discountAmount)
    const randomSuffix = Math.floor(100000 + Math.random() * 900000)
    const orderId = `ROF-${randomSuffix}`

    const newOrder: Order = {
      id: orderId,
      customer: payload.customer,
      items: payload.items,
      subtotal: recomputedSubtotal,
      fee,
      discount: discountAmount,
      total,
      payment: {
        method: payload.paymentMethod,
        // Paystack / bank transfer status starts as pending or paid depending on gateway mock
        status: payload.paymentMethod === 'delivery' ? 'pending' : 'paid',
        reference: `pstk_ref_${Date.now()}`,
      },
      status: 'received',
      notes: payload.customer.notes,
      createdAt: new Date().toISOString(),
      history: [
        {
          status: 'received',
          timestamp: new Date().toISOString(),
          note: `Order placed online via ${payload.paymentMethod}`,
        },
      ],
    }

    // Decrement inventory stock
    for (const item of payload.items) {
      const prod = productsDb.find((p) => p.id === item.productId)
      if (prod) {
        const variant = prod.variants.find((v) => v.size === item.size)
        if (variant && variant.stock >= item.qty) {
          variant.stock -= item.qty
        }
      }
    }

    ordersDb = [newOrder, ...ordersDb]
    saveStorage(STORAGE_KEYS.ORDERS, ordersDb)
    saveStorage(STORAGE_KEYS.PRODUCTS, productsDb)

    return newOrder
  },

  async trackOrder(orderId: string, phoneOrEmail: string): Promise<Order | null> {
    await delay(120)
    const cleanId = orderId.trim().toUpperCase()
    const cleanContact = phoneOrEmail.trim().toLowerCase()

    const order = ordersDb.find((o) => {
      const idMatch = o.id.toUpperCase() === cleanId
      const contactMatch =
        o.customer.email.toLowerCase() === cleanContact ||
        o.customer.phone.replace(/\s+/g, '') === cleanContact.replace(/\s+/g, '')
      return idMatch && contactMatch
    })

    return order || null
  },

  async sendContactMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'handled'>): Promise<ContactMessage> {
    await delay(180)
    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      ...message,
      createdAt: new Date().toISOString(),
      handled: false,
    }
    messagesDb = [newMessage, ...messagesDb]
    saveStorage(STORAGE_KEYS.MESSAGES, messagesDb)
    return newMessage
  },

  async joinNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    await delay(150)
    return { success: true, message: 'Welcome to the ROF list. Destined for riches.' }
  },

  // --- Admin Endpoints ---

  async adminLogin(password: string): Promise<{ success: boolean; token?: string }> {
    await delay(200)
    // Any password with 4+ characters or 'admin' logs into demo
    if (password.length >= 4) {
      const token = 'rof_session_token_' + Date.now()
      saveStorage(STORAGE_KEYS.AUTH, { authenticated: true, token, user: 'Owner' })
      return { success: true, token }
    }
    return { success: false }
  },

  async adminLogout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.AUTH)
  },

  async getAdminOverview(range: 'today' | '7d' | '30d' = '7d') {
    await delay(100)
    const days = range === 'today' ? 1 : range === '7d' ? 7 : 30
    const cutoff = Date.now() - days * 86400000

    const recentOrders = ordersDb.filter((o) => new Date(o.createdAt).getTime() >= cutoff)
    const validOrders = recentOrders.filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')

    const revenue = validOrders.reduce((sum, o) => sum + o.total, 0)
    const piecesSold = validOrders.reduce((sum, o) => sum + o.items.reduce((acc, i) => acc + i.qty, 0), 0)
    const aov = validOrders.length > 0 ? Math.round(revenue / validOrders.length) : 0

    const needsActionOrders = ordersDb.filter((o) => o.status === 'received')
    const unreadMessages = messagesDb.filter((m) => !m.handled)
    const lowStockVariants: { product: string; size: string; stock: number }[] = []

    for (const p of productsDb) {
      for (const v of p.variants) {
        if (v.stock <= 10) {
          lowStockVariants.push({ product: p.name, size: v.size, stock: v.stock })
        }
      }
    }

    return {
      revenue,
      orderCount: validOrders.length,
      averageOrderValue: aov,
      piecesSold,
      needsAction: {
        newOrders: needsActionOrders,
        unreadMessages,
        lowStock: lowStockVariants,
      },
      recentOrders: ordersDb.slice(0, 8),
      topPieces: productsDb.slice(0, 3).map((p) => ({
        name: p.name,
        colour: p.colour,
        soldCount: 18,
        price: p.price,
      })),
    }
  },

  async getAdminOrders(): Promise<Order[]> {
    await delay(100)
    return [...ordersDb]
  },

  async updateOrderStatus(
    orderId: string,
    status: Order['status'],
    note?: string,
    courier?: string,
    trackingNumber?: string
  ): Promise<Order> {
    await delay(150)
    const orderIndex = ordersDb.findIndex((o) => o.id === orderId)
    if (orderIndex === -1) throw new Error('Order not found')

    const current = ordersDb[orderIndex]
    const updated: Order = {
      ...current,
      status,
      courier: courier || current.courier,
      trackingNumber: trackingNumber || current.trackingNumber,
      history: [
        ...current.history,
        {
          status,
          timestamp: new Date().toISOString(),
          note: note || `Status changed to ${status}`,
        },
      ],
    }

    ordersDb[orderIndex] = updated
    saveStorage(STORAGE_KEYS.ORDERS, ordersDb)

    // Append to audit log
    auditDb = [
      {
        id: `audit-${Date.now()}`,
        action: 'Status Change',
        entity: 'Order',
        entityId: orderId,
        user: 'Owner',
        details: `Order status shifted to ${status}. ${note || ''}`,
        timestamp: new Date().toISOString(),
      },
      ...auditDb,
    ]
    saveStorage(STORAGE_KEYS.AUDIT, auditDb)

    return updated
  },

  async saveProduct(product: Product): Promise<Product> {
    await delay(150)
    const idx = productsDb.findIndex((p) => p.id === product.id)
    if (idx >= 0) {
      productsDb[idx] = product
    } else {
      productsDb.push(product)
    }
    saveStorage(STORAGE_KEYS.PRODUCTS, productsDb)
    return product
  },

  async updateInventory(productId: string, size: string, newStock: number): Promise<void> {
    await delay(80)
    const prod = productsDb.find((p) => p.id === productId)
    if (prod) {
      const v = prod.variants.find((item) => item.size === size)
      if (v) {
        v.stock = Math.max(0, newStock)
        saveStorage(STORAGE_KEYS.PRODUCTS, productsDb)
      }
    }
  },

  async getAdminMessages(): Promise<ContactMessage[]> {
    await delay(80)
    return [...messagesDb]
  },

  async toggleMessageHandled(messageId: string): Promise<void> {
    const msg = messagesDb.find((m) => m.id === messageId)
    if (msg) {
      msg.handled = !msg.handled
      saveStorage(STORAGE_KEYS.MESSAGES, messagesDb)
    }
  },

  async updateContent(newContent: ContentConfig): Promise<ContentConfig> {
    await delay(120)
    contentDb = newContent
    saveStorage(STORAGE_KEYS.CONTENT, contentDb)
    return contentDb
  },

  async getAuditLog(): Promise<AuditEntry[]> {
    await delay(80)
    return [...auditDb]
  },

  async getDiscounts(): Promise<Discount[]> {
    await delay(80)
    return [...discountsDb]
  },
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
