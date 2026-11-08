/**
 * ROF RAGE Motion System
 * Restrained, consistent, fast.
 */

export const transitions = {
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  easeInOutQuart: [0.76, 0, 0.24, 1] as const,
}

export const durations = {
  micro: 0.15,
  standard: 0.32,
  page: 0.52,
  entrance: 0.7,
  stagger: 0.06,
}

export const springs = {
  sheet: {
    type: 'spring' as const,
    stiffness: 380,
    damping: 36,
  },
  bounce: {
    type: 'spring' as const,
    stiffness: 450,
    damping: 28,
  },
}

export const motionTokens = {
  transitions,
  durations,
  springs,
}

