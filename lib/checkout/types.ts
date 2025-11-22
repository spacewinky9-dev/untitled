/**
 * Checkout Types and Interfaces
 */

export interface CheckoutStep {
  id: number
  name: string
  title: string
  description: string
}

export interface ShippingAddress {
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface BillingAddress extends ShippingAddress {
  sameAsShipping: boolean
}

export interface CheckoutFormData {
  shipping: ShippingAddress
  billing: BillingAddress
  notes?: string
  termsAccepted: boolean
  saveAddress: boolean
}

export interface CheckoutState {
  currentStep: number
  formData: Partial<CheckoutFormData>
  isProcessing: boolean
  errors: Record<string, string>
}

export const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
]
