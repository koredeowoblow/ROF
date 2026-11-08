import { z } from 'zod'

export const ProductVariantSchema = z.object({
  size: z.enum(['S', 'M', 'L', 'XL', 'XXL']),
  stock: z.number().int().min(0),
})

export type Variant = z.infer<typeof ProductVariantSchema>

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  colour: z.string(),
  colourKey: z.enum(['green', 'white', 'black']),
  swatch: z.string(),
  print: z.string(),
  price: z.number().int().positive(),
  blurb: z.string(),
  ground: z.enum(['ink', 'bone']),
  zoomOrigin: z.string().default('50% 50%'),
  images: z.array(z.string()),
  pairId: z.string().optional(),
  position: z.number().int(),
  published: z.boolean(),
  variants: z.array(ProductVariantSchema),
})

export type Product = z.infer<typeof ProductSchema>

export const CustomerInfoSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid Nigerian phone number required'),
  email: z.string().email('Valid email address required'),
  address: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  notes: z.string().optional(),
})

export type CustomerInfo = z.infer<typeof CustomerInfoSchema>

export const OrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  colour: z.string(),
  size: z.enum(['S', 'M', 'L', 'XL', 'XXL']),
  qty: z.number().int().positive(),
  unitPrice: z.number().int().positive(),
  image: z.string(),
})

export type OrderItem = z.infer<typeof OrderItemSchema>

export const OrderStatusEnum = z.enum([
  'received',
  'confirmed',
  'packed',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'refunded',
])

export type OrderStatus = z.infer<typeof OrderStatusEnum>

export const PaymentMethodEnum = z.enum(['paystack', 'bank_transfer', 'delivery'])
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>

export const PaymentStatusEnum = z.enum(['pending', 'paid', 'failed'])
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>

export const OrderHistoryItemSchema = z.object({
  status: OrderStatusEnum,
  timestamp: z.string(),
  note: z.string().optional(),
})

export type OrderHistoryItem = z.infer<typeof OrderHistoryItemSchema>

export const OrderSchema = z.object({
  id: z.string(), // Format: ROF-XXXXXX
  customer: CustomerInfoSchema,
  items: z.array(OrderItemSchema),
  subtotal: z.number().int(),
  fee: z.number().int(),
  discount: z.number().int().default(0),
  total: z.number().int(),
  payment: z.object({
    method: PaymentMethodEnum,
    status: PaymentStatusEnum,
    reference: z.string(),
  }),
  status: OrderStatusEnum,
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  courier: z.string().optional(),
  trackingNumber: z.string().optional(),
  createdAt: z.string(),
  history: z.array(OrderHistoryItemSchema),
})

export type Order = z.infer<typeof OrderSchema>

export const ContactMessageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  createdAt: z.string().optional(),
  handled: z.boolean().default(false),
})

export type ContactMessage = z.infer<typeof ContactMessageSchema>

export const DiscountSchema = z.object({
  id: z.string(),
  code: z.string().min(3),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive(),
  minOrder: z.number().int().default(0),
  expiresAt: z.string().optional(),
  usageLimit: z.number().int().optional(),
  usedCount: z.number().int().default(0),
  active: z.boolean().default(true),
})

export type Discount = z.infer<typeof DiscountSchema>

export const AuditEntrySchema = z.object({
  id: z.string(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string(),
  user: z.string(),
  details: z.string(),
  timestamp: z.string(),
})

export type AuditEntry = z.infer<typeof AuditEntrySchema>

