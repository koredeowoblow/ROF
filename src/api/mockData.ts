import { Order, ContactMessage, AuditEntry, Discount } from './types'
import { initialProducts } from './products'

export const initialOrders: Order[] = [
  {
    id: 'ROF-849102',
    customer: {
      name: 'Chidi Okafor',
      phone: '+234 803 234 5678',
      email: 'chidi.okafor@gmail.com',
      address: '14 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos',
      notes: 'Call on arrival at the security gate',
    },
    items: [
      {
        productId: 'prod-1',
        name: 'Destined Cards Tee',
        colour: 'Forest green',
        size: 'L',
        qty: 1,
        unitPrice: 30000,
        image: '/images/destined-cards-green.webp',
      },
    ],
    subtotal: 30000,
    fee: 2500,
    discount: 0,
    total: 32500,
    payment: {
      method: 'paystack',
      status: 'paid',
      reference: 'pstk_ref_982741920',
    },
    status: 'received',
    createdAt: '2026-11-08T09:15:00Z',
    history: [
      {
        status: 'received',
        timestamp: '2026-11-08T09:15:00Z',
        note: 'Order submitted online via Paystack card payment',
      },
    ],
  },
  {
    id: 'ROF-742918',
    customer: {
      name: 'Amina Danjuma',
      phone: '+234 812 345 6789',
      email: 'amina.d@outlook.com',
      address: 'Plot 412, Constitution Avenue, Central Business District',
      city: 'Abuja',
      state: 'FCT Abuja',
    },
    items: [
      {
        productId: 'prod-2',
        name: 'Rage Wave Tee',
        colour: 'White',
        size: 'M',
        qty: 2,
        unitPrice: 25000,
        image: '/images/rage-wave-white.webp',
      },
      {
        productId: 'prod-4',
        name: 'Rage Scribble Tee',
        colour: 'White',
        size: 'M',
        qty: 1,
        unitPrice: 28000,
        image: '/images/rage-scribble-white.webp',
      },
    ],
    subtotal: 78000,
    fee: 4500,
    discount: 0,
    total: 82500,
    payment: {
      method: 'paystack',
      status: 'paid',
      reference: 'pstk_ref_882194012',
    },
    status: 'confirmed',
    createdAt: '2026-11-07T14:20:00Z',
    history: [
      { status: 'received', timestamp: '2026-11-07T14:20:00Z' },
      { status: 'confirmed', timestamp: '2026-11-07T15:00:00Z', note: 'Payment verified by staff' },
    ],
  },
  {
    id: 'ROF-631092',
    customer: {
      name: 'Babajide Adeleke',
      phone: '+234 809 888 1234',
      email: 'baba.adeleke@yahoo.com',
      address: '22 Isaac John Street, GRA',
      city: 'Ikeja',
      state: 'Lagos',
    },
    items: [
      {
        productId: 'prod-3',
        name: 'Rage Wave Tee',
        colour: 'Black',
        size: 'XL',
        qty: 1,
        unitPrice: 25000,
        image: '/images/rage-wave-black.webp',
      },
    ],
    subtotal: 25000,
    fee: 2500,
    discount: 0,
    total: 27500,
    payment: {
      method: 'bank_transfer',
      status: 'paid',
      reference: 'trans_ref_77182910',
    },
    status: 'packed',
    courier: 'GIG Logistics',
    createdAt: '2026-11-07T11:00:00Z',
    history: [
      { status: 'received', timestamp: '2026-11-07T11:00:00Z' },
      { status: 'confirmed', timestamp: '2026-11-07T11:30:00Z' },
      { status: 'packed', timestamp: '2026-11-07T16:00:00Z', note: 'Packed in signature black ROF sleeve' },
    ],
  },
  {
    id: 'ROF-529184',
    customer: {
      name: 'Ngozi Eze',
      phone: '+234 814 555 7788',
      email: 'ngozi.eze@gmail.com',
      address: '9 Trans Amadi Industrial Layout',
      city: 'Port Harcourt',
      state: 'Rivers',
    },
    items: [
      {
        productId: 'prod-5',
        name: 'Rage Scribble Tee',
        colour: 'Black',
        size: 'M',
        qty: 1,
        unitPrice: 28000,
        image: '/images/rage-scribble-black.webp',
      },
    ],
    subtotal: 28000,
    fee: 4500,
    discount: 0,
    total: 32500,
    payment: {
      method: 'paystack',
      status: 'paid',
      reference: 'pstk_ref_552190234',
    },
    status: 'out_for_delivery',
    courier: 'DHL Express',
    trackingNumber: 'DHL-NG-8892104',
    createdAt: '2026-11-06T10:15:00Z',
    history: [
      { status: 'received', timestamp: '2026-11-06T10:15:00Z' },
      { status: 'confirmed', timestamp: '2026-11-06T10:45:00Z' },
      { status: 'packed', timestamp: '2026-11-06T14:30:00Z' },
      { status: 'out_for_delivery', timestamp: '2026-11-07T08:00:00Z', note: 'Dispatched via DHL Express' },
    ],
  },
  {
    id: 'ROF-418290',
    customer: {
      name: 'Femi Balogun',
      phone: '+234 802 111 4455',
      email: 'femi.balogun@techhub.ng',
      address: '5 Glover Road, Ikoyi',
      city: 'Lagos',
      state: 'Lagos',
    },
    items: [
      {
        productId: 'prod-1',
        name: 'Destined Cards Tee',
        colour: 'Forest green',
        size: 'XXL',
        qty: 1,
        unitPrice: 30000,
        image: '/images/destined-cards-green.webp',
      },
      {
        productId: 'prod-3',
        name: 'Rage Wave Tee',
        colour: 'Black',
        size: 'XXL',
        qty: 1,
        unitPrice: 25000,
        image: '/images/rage-wave-black.webp',
      },
    ],
    subtotal: 55000,
    fee: 2500,
    discount: 0,
    total: 57500,
    payment: {
      method: 'paystack',
      status: 'paid',
      reference: 'pstk_ref_33910284',
    },
    status: 'delivered',
    courier: 'Kwik Delivery',
    trackingNumber: 'KWIK-9921',
    createdAt: '2026-11-05T08:00:00Z',
    history: [
      { status: 'received', timestamp: '2026-11-05T08:00:00Z' },
      { status: 'confirmed', timestamp: '2026-11-05T08:30:00Z' },
      { status: 'packed', timestamp: '2026-11-05T10:00:00Z' },
      { status: 'out_for_delivery', timestamp: '2026-11-05T12:00:00Z' },
      { status: 'delivered', timestamp: '2026-11-05T15:45:00Z', note: 'Signed for by customer' },
    ],
  },
  // Additional seeded orders for rich table, virtual list & analytics
  ...Array.from({ length: 15 }, (_, i) => {
    const num = 418280 - i
    const statuses: Order['status'][] = [
      'received',
      'confirmed',
      'packed',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'refunded',
    ]
    const status = statuses[i % statuses.length]
    const prod = initialProducts[i % initialProducts.length]
    const isLagos = i % 2 === 0
    const fee = isLagos ? 2500 : 4500
    const subtotal = prod.price

    return {
      id: `ROF-${num}`,
      customer: {
        name: [
          'Kolawole Sanwo',
          'Zainab Aliyu',
          'Efe Omoruyi',
          'Yetunde Bakare',
          'Somto Chukwu',
          'Ibrahim Musa',
          'Temitope Davies',
          'Hadiza Umar',
        ][i % 8],
        phone: `+234 80${(i + 2) % 9} ${100 + i * 17} ${2000 + i * 33}`,
        email: `customer${i + 1}@example.ng`,
        address: `${10 + i * 3} Commercial Avenue`,
        city: isLagos ? 'Lagos' : 'Ibadan',
        state: isLagos ? 'Lagos' : 'Oyo',
      },
      items: [
        {
          productId: prod.id,
          name: prod.name,
          colour: prod.colour,
          size: ['S', 'M', 'L', 'XL', 'XXL'][i % 5] as any,
          qty: 1,
          unitPrice: prod.price,
          image: prod.images[0],
        },
      ],
      subtotal,
      fee,
      discount: 0,
      total: subtotal + fee,
      payment: {
        method: (i % 3 === 0 ? 'delivery' : i % 3 === 1 ? 'bank_transfer' : 'paystack') as any,
        status: (status === 'cancelled' ? 'failed' : 'paid') as any,
        reference: `ref_seed_${num}`,
      },
      status,
      createdAt: new Date(Date.now() - (i + 1) * 86400000 * 1.5).toISOString(),
      history: [
        {
          status: 'received',
          timestamp: new Date(Date.now() - (i + 1) * 86400000 * 1.5).toISOString(),
        },
      ],
    }
  }),
]

export const initialMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Tunde Adele',
    email: 'tunde@creatives.ng',
    phone: '+234 803 999 1122',
    message: 'Do you carry wholesale packs for a fashion showroom pop-up in Victoria Island next week?',
    createdAt: '2026-11-08T08:30:00Z',
    handled: false,
  },
  {
    id: 'msg-2',
    name: 'Sandra Briggs',
    email: 'sandra.b@gmail.com',
    message: 'Can I exchange my Rage Wave tee for a size L? The M is slightly snug across the shoulders.',
    createdAt: '2026-11-07T17:15:00Z',
    handled: true,
  },
  {
    id: 'msg-3',
    name: 'David Mark',
    email: 'dmark@legacy.com',
    message: 'Destined Cards tee is incredible. When are you restocking XXL?',
    createdAt: '2026-11-06T12:00:00Z',
    handled: false,
  },
]

export const initialDiscounts: Discount[] = [
  {
    id: 'disc-1',
    code: 'LEGACY10',
    type: 'percentage',
    value: 10,
    minOrder: 50000,
    usedCount: 14,
    active: true,
  },
  {
    id: 'disc-2',
    code: 'ROFFAMILY',
    type: 'fixed',
    value: 5000,
    minOrder: 60000,
    usedCount: 8,
    active: true,
  },
]

export const initialAuditLog: AuditEntry[] = [
  {
    id: 'audit-1',
    action: 'Order Status Update',
    entity: 'Order',
    entityId: 'ROF-529184',
    user: 'Staff (Admin)',
    details: 'Status changed from packed to out_for_delivery via DHL Express',
    timestamp: '2026-11-07T08:00:00Z',
  },
  {
    id: 'audit-2',
    action: 'Inventory Adjustment',
    entity: 'Product',
    entityId: 'prod-1',
    user: 'Owner',
    details: 'Restocked Destined Cards Tee (L) +10 units from production batch 2',
    timestamp: '2026-11-06T19:30:00Z',
  },
  {
    id: 'audit-3',
    action: 'Content Update',
    entity: 'Content',
    entityId: 'delivery.lagosFee',
    user: 'Owner',
    details: 'Updated Lagos delivery fee from 2000 to 2500 NGN',
    timestamp: '2026-11-05T14:10:00Z',
  },
]

