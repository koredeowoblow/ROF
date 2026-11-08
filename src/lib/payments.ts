/**
 * Payment Provider Interface & Implementations
 * Pluggable architecture supporting Paystack Nigeria, Direct Studio Transfer, and Pay on Delivery.
 */

export interface PaymentInitializeParams {
  orderId: string
  amount: number // In NGN
  email: string
  phone: string
  callbackUrl?: string
}

export interface PaymentInitializeResponse {
  reference: string
  authorizationUrl?: string
  status: 'pending' | 'success' | 'failed'
}

export interface PaymentProvider {
  name: string
  initialize(params: PaymentInitializeParams): Promise<PaymentInitializeResponse>
  verify(reference: string): Promise<{ success: boolean; paidAt?: string }>
}

/**
 * Paystack Implementation Stub (Nigeria)
 * PCI-DSS Level 1 compliant gateway processing Mastercard, Visa, Verve, USSD, and Bank Transfer.
 */
export class PaystackPaymentProvider implements PaymentProvider {
  name = 'Paystack Nigeria'

  async initialize(params: PaymentInitializeParams): Promise<PaymentInitializeResponse> {
    const reference = `pstk_ref_${Date.now()}_${Math.floor(Math.random() * 10000)}`

    // In production, this posts to https://api.paystack.co/transaction/initialize
    // and returns the Paystack standard checkout popup/redirect authorization_url.
    return {
      reference,
      authorizationUrl: `https://checkout.paystack.com/${reference}`,
      status: 'pending',
    }
  }

  async verify(reference: string): Promise<{ success: boolean; paidAt?: string }> {
    // In production, the webhook or GET /transaction/verify/:reference is the source of truth
    return {
      success: true,
      paidAt: new Date().toISOString(),
    }
  }
}

/**
 * Bank Transfer Provider Stub
 */
export class BankTransferPaymentProvider implements PaymentProvider {
  name = 'Direct Studio Bank Transfer'

  async initialize(params: PaymentInitializeParams): Promise<PaymentInitializeResponse> {
    const reference = `bank_ref_${Date.now()}`
    return {
      reference,
      status: 'pending',
    }
  }

  async verify(reference: string): Promise<{ success: boolean }> {
    return { success: true }
  }
}

/**
 * Pay on Delivery Provider Stub
 */
export class DeliveryPaymentProvider implements PaymentProvider {
  name = 'Pay on Delivery'

  async initialize(params: PaymentInitializeParams): Promise<PaymentInitializeResponse> {
    return {
      reference: `cod_ref_${Date.now()}`,
      status: 'pending',
    }
  }

  async verify(reference: string): Promise<{ success: boolean }> {
    return { success: true }
  }
}

export const paymentProviders = {
  paystack: new PaystackPaymentProvider(),
  bank_transfer: new BankTransferPaymentProvider(),
  delivery: new DeliveryPaymentProvider(),
}

