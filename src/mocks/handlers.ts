import { http, HttpResponse } from 'msw'
import { initialProducts } from '@/api/products'
import { initialOrders, initialMessages, initialDiscounts, initialAuditLog } from '@/api/mockData'
import { initialContentConfig } from '@/content/config'

let products = [...initialProducts]
let orders = [...initialOrders]
let messages = [...initialMessages]
let content = { ...initialContentConfig }
let discounts = [...initialDiscounts]
let audit = [...initialAuditLog]

export const handlers = [
  // --- Public Store Endpoints ---
  http.get('/api/v1/products', () => {
    return HttpResponse.json(products)
  }),

  http.get('/api/v1/products/:slug', ({ params }) => {
    const { slug } = params
    const product = products.find((p) => p.slug === slug || p.id === slug)
    if (!product) {
      return new HttpResponse(null, { status: 404, statusText: 'Product not found' })
    }
    return HttpResponse.json(product)
  }),

  http.get('/api/v1/content', () => {
    return HttpResponse.json(content)
  }),

  http.post('/api/v1/orders', async ({ request }) => {
    const body = (await request.json()) as any
    const idempotencyKey = request.headers.get('Idempotency-Key')

    // Server-side price recalculation (Never trust client prices)
    let recomputedSubtotal = 0
    for (const item of body.items) {
      const prod = products.find((p) => p.id === item.productId)
      const unitPrice = prod ? prod.price : item.unitPrice
      recomputedSubtotal += unitPrice * item.qty
    }

    const isLagos = body.customer.state.toLowerCase().includes('lagos')
    const fee = isLagos ? content.delivery.lagosFee.value : content.delivery.interstateFee.value
    const total = recomputedSubtotal + fee

    const newOrder = {
      id: `ROF-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: body.customer,
      items: body.items,
      subtotal: recomputedSubtotal,
      fee,
      discount: 0,
      total,
      payment: {
        method: body.paymentMethod || 'paystack',
        status: body.paymentMethod === 'delivery' ? 'pending' : 'paid',
        reference: `pstk_ref_${Date.now()}`,
      },
      status: 'received',
      notes: body.customer.notes,
      createdAt: new Date().toISOString(),
      history: [
        {
          status: 'received',
          timestamp: new Date().toISOString(),
          note: `Order placed online via ${body.paymentMethod}`,
        },
      ],
    }

    orders = [newOrder as any, ...orders]
    return HttpResponse.json(newOrder, { status: 201 })
  }),

  http.post('/api/v1/orders/track', async ({ request }) => {
    const { orderId, contact } = (await request.json()) as any
    const cleanId = orderId?.trim().toUpperCase()
    const cleanContact = contact?.trim().toLowerCase()

    const found = orders.find((o) => {
      return (
        o.id.toUpperCase() === cleanId &&
        (o.customer.email.toLowerCase() === cleanContact ||
          o.customer.phone.replace(/\s+/g, '') === cleanContact?.replace(/\s+/g, ''))
      )
    })

    if (!found) {
      return new HttpResponse(null, { status: 404, statusText: 'Order not found' })
    }
    return HttpResponse.json(found)
  }),

  http.post('/api/v1/payments/paystack/initialize', async ({ request }) => {
    const { amount, email, orderId } = (await request.json()) as any
    const reference = `pstk_ref_${Date.now()}`
    return HttpResponse.json({
      status: true,
      message: 'Authorization url created',
      data: {
        authorization_url: `https://checkout.paystack.com/${reference}`,
        access_code: `code_${Date.now()}`,
        reference,
      },
    })
  }),

  http.post('/api/v1/payments/paystack/webhook', async ({ request }) => {
    // Payment webhook verification
    const event = (await request.json()) as any
    if (event.event === 'charge.success') {
      const orderRef = event.data.reference
      const order = orders.find((o) => o.payment.reference === orderRef)
      if (order) {
        order.payment.status = 'paid'
        order.status = 'confirmed'
      }
    }
    return HttpResponse.json({ status: 'success' })
  }),

  http.post('/api/v1/messages', async ({ request }) => {
    const body = (await request.json()) as any
    const newMsg = {
      id: `msg-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      handled: false,
    }
    messages = [newMsg, ...messages]
    return HttpResponse.json(newMsg, { status: 201 })
  }),

  http.post('/api/v1/newsletter', () => {
    return HttpResponse.json({ success: true, message: 'Welcome to the ROF list. Destined for riches.' })
  }),

  // --- Admin Endpoints ---
  http.post('/api/v1/auth/login', async ({ request }) => {
    const { password } = (await request.json()) as any
    if (password === 'admin' || password?.length >= 4) {
      return HttpResponse.json({
        success: true,
        token: 'rof_session_token_' + Date.now(),
        user: { name: 'Owner', role: 'Owner' },
      })
    }
    return HttpResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
  }),

  http.post('/api/v1/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/v1/admin/overview', () => {
    const validOrders = orders.filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
    const revenue = validOrders.reduce((sum, o) => sum + o.total, 0)
    const piecesSold = validOrders.reduce(
      (sum, o) => sum + o.items.reduce((acc, i) => acc + i.qty, 0),
      0
    )

    return HttpResponse.json({
      revenue,
      orderCount: validOrders.length,
      averageOrderValue: validOrders.length ? Math.round(revenue / validOrders.length) : 0,
      piecesSold,
      recentOrders: orders.slice(0, 8),
    })
  }),

  http.get('/api/v1/admin/orders', () => {
    return HttpResponse.json(orders)
  }),

  http.post('/api/v1/admin/orders/:id/transition', async ({ params, request }) => {
    const { id } = params
    const { status, note, courier, trackingNumber } = (await request.json()) as any
    const order = orders.find((o) => o.id === id)
    if (!order) {
      return new HttpResponse(null, { status: 404, statusText: 'Order not found' })
    }
    order.status = status
    if (courier) order.courier = courier
    if (trackingNumber) order.trackingNumber = trackingNumber
    order.history.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status transitioned to ${status}`,
    })
    return HttpResponse.json(order)
  }),

  http.get('/api/v1/admin/inventory', () => {
    return HttpResponse.json(products)
  }),

  http.get('/api/v1/admin/customers', () => {
    return HttpResponse.json(orders.map((o) => o.customer))
  }),

  http.get('/api/v1/admin/messages', () => {
    return HttpResponse.json(messages)
  }),

  http.get('/api/v1/admin/content', () => {
    return HttpResponse.json(content)
  }),

  http.put('/api/v1/admin/content', async ({ request }) => {
    content = (await request.json()) as any
    return HttpResponse.json(content)
  }),

  http.get('/api/v1/admin/discounts', () => {
    return HttpResponse.json(discounts)
  }),

  http.get('/api/v1/admin/audit', () => {
    return HttpResponse.json(audit)
  }),
]
