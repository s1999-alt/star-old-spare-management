import type { IdType, OwnerDocs } from '../data/vehicles'

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/
const AADHAAR_RE = /^\d{12}$/

export const ID_LABEL: Record<IdType, string> = { pan: 'PAN', aadhaar: 'Aadhaar' }

export function idError(type: IdType, value: string): string | null {
  if (!value) return null
  if (type === 'pan' && !PAN_RE.test(value)) return 'PAN must look like ABCDE1234F'
  if (type === 'aadhaar' && !AADHAAR_RE.test(value)) return 'Aadhaar must be 12 digits'
  return null
}

/** Aadhaar is shown masked (only the last 4 digits), as UIDAI recommends. */
export function displayId(type: IdType, value: string) {
  if (type === 'aadhaar') return `XXXX XXXX ${value.slice(-4)}`
  return value
}

/** Groups Aadhaar digits as 1234 5678 9012 while typing. */
export const groupAadhaar = (digits: string) => digits.replace(/(\d{4})(?=\d)/g, '$1 ')

export function isOwnerComplete(o: OwnerDocs) {
  return Boolean(
    o.rcNumber && o.rcImage && o.idNumber && o.idImage && !idError(o.idType, o.idNumber),
  )
}
