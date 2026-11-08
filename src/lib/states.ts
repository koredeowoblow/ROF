/**
 * Nigerian States and Delivery Zone Mapping
 * Lagos State has local express dispatch (₦2,500 draft fee).
 * Interstate dispatch covers all other 35 states and FCT Abuja (₦4,500 draft fee).
 */

export interface NigerianState {
  code: string
  name: string
  isLagos: boolean
}

export const NIGERIAN_STATES: NigerianState[] = [
  { code: 'LA', name: 'Lagos', isLagos: true },
  { code: 'AB', name: 'Abia', isLagos: false },
  { code: 'FC', name: 'Abuja (FCT)', isLagos: false },
  { code: 'AD', name: 'Adamawa', isLagos: false },
  { code: 'AK', name: 'Akwa Ibom', isLagos: false },
  { code: 'AN', name: 'Anambra', isLagos: false },
  { code: 'BA', name: 'Bauchi', isLagos: false },
  { code: 'BY', name: 'Bayelsa', isLagos: false },
  { code: 'BE', name: 'Benue', isLagos: false },
  { code: 'BO', name: 'Borno', isLagos: false },
  { code: 'CR', name: 'Cross River', isLagos: false },
  { code: 'DE', name: 'Delta', isLagos: false },
  { code: 'EB', name: 'Ebonyi', isLagos: false },
  { code: 'ED', name: 'Edo', isLagos: false },
  { code: 'EK', name: 'Ekiti', isLagos: false },
  { code: 'EN', name: 'Enugu', isLagos: false },
  { code: 'GO', name: 'Gombe', isLagos: false },
  { code: 'IM', name: 'Imo', isLagos: false },
  { code: 'JI', name: 'Jigawa', isLagos: false },
  { code: 'KD', name: 'Kaduna', isLagos: false },
  { code: 'KN', name: 'Kano', isLagos: false },
  { code: 'KT', name: 'Katsina', isLagos: false },
  { code: 'KE', name: 'Kebbi', isLagos: false },
  { code: 'KO', name: 'Kogi', isLagos: false },
  { code: 'KW', name: 'Kwara', isLagos: false },
  { code: 'NA', name: 'Nasarawa', isLagos: false },
  { code: 'NI', name: 'Niger', isLagos: false },
  { code: 'OG', name: 'Ogun', isLagos: false },
  { code: 'ON', name: 'Ondo', isLagos: false },
  { code: 'OS', name: 'Osun', isLagos: false },
  { code: 'OY', name: 'Oyo', isLagos: false },
  { code: 'PL', name: 'Plateau', isLagos: false },
  { code: 'RI', name: 'Rivers', isLagos: false },
  { code: 'SO', name: 'Sokoto', isLagos: false },
  { code: 'TA', name: 'Taraba', isLagos: false },
  { code: 'YO', name: 'Yobe', isLagos: false },
  { code: 'ZA', name: 'Zamfara', isLagos: false },
]

