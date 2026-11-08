/**
 * ROF Analytics Abstraction
 * Privacy-friendly unified telemetry interface.
 * Tracks core commerce actions (page_view, add_to_bag, begin_checkout, purchase)
 * with no external vendor tracking scripts wired in by default.
 */

export type AnalyticsEvent =
  | { type: 'page_view'; path: string; title?: string }
  | { type: 'add_to_bag'; productId: string; name: string; size: string; price: number }
  | { type: 'remove_from_bag'; productId: string; size: string }
  | { type: 'begin_checkout'; itemCount: number; totalAmount: number }
  | { type: 'purchase'; orderId: string; totalAmount: number; paymentMethod: string; itemCount: number }
  | { type: 'view_piece'; productId: string; name: string }

export function track(event: AnalyticsEvent): void {
  // Dispatches to internal event listener or console in debug mode
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rof_analytics', { detail: event }))
  }
}
