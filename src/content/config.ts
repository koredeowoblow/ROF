/**
 * Brand Content Configuration
 * Editable copy and settings. Values that are draft/unconfirmed carry `isDraft: true`.
 * These draft markers are displayed in the Admin Content Manager so the owner can review and finalize them.
 */

export interface EditableItem<T = string> {
  value: T
  isDraft: boolean
  label: string
  note?: string
}

export interface ContentConfig {
  brand: {
    name: string
    subname: string
    tagline: EditableItem<string>
    manifestoHeadline: EditableItem<string>
    manifestoLead: EditableItem<string>
    fourPillars: string[]
  }
  delivery: {
    lagosFee: EditableItem<number>
    interstateFee: EditableItem<number>
    dispatchWindow: EditableItem<string>
    exchangePolicy: EditableItem<string>
  }
  contact: {
    email: EditableItem<string>
    phone: EditableItem<string>
    whatsapp: EditableItem<string>
    instagram: EditableItem<string>
    location: EditableItem<string>
  }
  help: {
    faqs: Array<{
      id: string
      question: string
      answer: string
      isDraft?: boolean
    }>
    sizeGuide: {
      isDraft: boolean
      note: string
      measurements: Array<{
        size: string
        chestCm: string
        lengthCm: string
        shoulderCm: string
      }>
    }
  }
}

export const initialContentConfig: ContentConfig = {
  brand: {
    name: 'ROF',
    subname: 'ROF RAGE',
    tagline: {
      value: 'Destined for riches',
      isDraft: false,
      label: 'Tagline',
    },
    manifestoHeadline: {
      value: 'More than clothing. A *mindset.*',
      isDraft: false,
      label: 'Manifesto Headline',
    },
    manifestoLead: {
      value:
        'ROF stands for ambition, confidence and originality. It is made for people who stay focused on their goals, never settle for less, and wear it with pride because it represents something bigger than themselves.',
      isDraft: false,
      label: 'Manifesto Lead',
    },
    fourPillars: ['Ambition', 'Confidence', 'Originality', 'Greatness'],
  },
  delivery: {
    lagosFee: {
      value: 2500,
      isDraft: true,
      label: 'Lagos Delivery Fee (NGN)',
      note: 'Draft fee pending final 2026 courier tariff schedule',
    },
    interstateFee: {
      value: 4500,
      isDraft: true,
      label: 'Interstate Delivery Fee (NGN)',
      note: 'Draft flat rate for deliveries outside Lagos state',
    },
    dispatchWindow: {
      value: '1 to 2 business days within Lagos. 3 to 5 business days for other states.',
      isDraft: true,
      label: 'Dispatch Timelines',
    },
    exchangePolicy: {
      value:
        'Exchanges accepted within 7 days of delivery. Items must be unworn, unwashed with tags intact. Customer covers return courier fee unless the item is defective.',
      isDraft: true,
      label: 'Exchange Window & Terms',
      note: 'Awaiting confirmation on return window length',
    },
  },
  contact: {
    email: {
      value: 'orders@rofrage.com',
      isDraft: true,
      label: 'Customer Support Email',
    },
    phone: {
      value: '+234 800 763 7243',
      isDraft: true,
      label: 'Phone Line',
    },
    whatsapp: {
      value: '+234 800 763 7243',
      isDraft: true,
      label: 'WhatsApp Concierge',
    },
    instagram: {
      value: '@rofrage',
      isDraft: true,
      label: 'Instagram Handle',
    },
    location: {
      value: 'Lagos, Nigeria',
      isDraft: false,
      label: 'Dispatch Hub',
    },
  },
  help: {
    faqs: [
      {
        id: 'faq-1',
        question: 'What is the fit of ROF RAGE tees?',
        answer:
          'All ROF RAGE pieces feature an intentionally oversized, boxy streetwear cut with dropped shoulders and heavy ribbing. If you prefer a fitted look, choose one size smaller than your standard size.',
        isDraft: false,
      },
      {
        id: 'faq-2',
        question: 'How do deliveries work outside Lagos?',
        answer:
          'We ship across all 36 Nigerian states using registered express delivery partners. Tracking credentials are sent via SMS and email once your package is dispatched.',
        isDraft: false,
      },
      {
        id: 'faq-3',
        question: 'Can I pay on delivery?',
        answer:
          'Pay on delivery is supported in selected Lagos mainland and island districts subject to dispatch courier confirmation. Instant bank transfer and online card payments are processed securely via Paystack.',
        isDraft: true,
      },
      {
        id: 'faq-4',
        question: 'How do I care for my prints?',
        answer:
          'Wash inside-out in cold water. Do not bleach. Air dry in the shade. Iron inside-out on low heat and never touch an iron directly to the screenprint or rubberized elements.',
        isDraft: false,
      },
    ],
    sizeGuide: {
      isDraft: true,
      note: 'Boxy streetwear cut. Measurements in centimeters flat across garment.',
      measurements: [
        { size: 'S', chestCm: '56', lengthCm: '72', shoulderCm: '54' },
        { size: 'M', chestCm: '59', lengthCm: '74', shoulderCm: '56' },
        { size: 'L', chestCm: '62', lengthCm: '76', shoulderCm: '58' },
        { size: 'XL', chestCm: '65', lengthCm: '78', shoulderCm: '60' },
        { size: 'XXL', chestCm: '68', lengthCm: '80', shoulderCm: '62' },
      ],
    },
  },
}
