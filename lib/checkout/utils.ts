/**
 * Checkout Utility Functions
 */

import type { ShippingAddress, BillingAddress, CheckoutStep } from './types'

export const CHECKOUT_STEPS: CheckoutStep[] = [
  {
    id: 1,
    name: 'shipping',
    title: 'Shipping Information',
    description: 'Enter your delivery address'
  },
  {
    id: 2,
    name: 'billing',
    title: 'Billing Information',  
    description: 'Enter your billing details'
  },
  {
    id: 3,
    name: 'review',
    title: 'Review Order',
    description: 'Review your order details'
  },
  {
    id: 4,
    name: 'payment',
    title: 'Payment',
    description: 'Complete your purchase'
  }
]

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/ // Indian phone number
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function validatePostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^\d{6}$/ // Indian postal code
  return postalCodeRegex.test(postalCode)
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{5})(\d{5})$/)
  if (match) {
    return `${match[1]} ${match[2]}`
  }
  return phone
}

export function formatPostalCode(code: string): string {
  const cleaned = code.replace(/\D/g, '')
  return cleaned.slice(0, 6)
}

export function validateShippingAddress(shipping: Partial<ShippingAddress>): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (!shipping.fullName?.trim()) errors.fullName = 'Full name is required'
  if (!shipping.phone?.trim()) errors.phone = 'Phone number is required'
  else if (!validatePhone(shipping.phone)) errors.phone = 'Invalid phone number'
  
  if (!shipping.email?.trim()) errors.email = 'Email is required'
  else if (!validateEmail(shipping.email)) errors.email = 'Invalid email address'
  
  if (!shipping.address?.trim()) errors.address = 'Address is required'
  if (!shipping.city?.trim()) errors.city = 'City is required'
  if (!shipping.state?.trim()) errors.state = 'State is required'
  
  if (!shipping.postalCode?.trim()) errors.postalCode = 'Postal code is required'
  else if (!validatePostalCode(shipping.postalCode)) errors.postalCode = 'Invalid postal code'
  
  return errors
}

export function validateBillingAddress(billing: Partial<BillingAddress>): Record<string, string> {
  if (billing.sameAsShipping) return {}
  return validateShippingAddress(billing)
}
