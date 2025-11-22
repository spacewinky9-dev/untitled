# DELTA.MD - AUTONOMOUS DEVELOPMENT ROADMAP
# ══════════════════════════════════════════════════════════════════════════════
# Damday Village Smart Village Platform - Complete Implementation Guide
# Version: 2.0.0 | Last Updated: 2025-11-22
# ══════════════════════════════════════════════════════════════════════════════

## 🤖 AUTONOMOUS DEVELOPMENT PROTOCOL

### How to Use This File
1. **Read Current Status** - Check tracking tables to understand completed vs remaining work
2. **Identify Next Phase** - Find the next uncompleted phase in the current PR
3. **Review Phase Details** - Read implementation specifications, file paths, and code examples
4. **Implement Completely** - Build all components, functions, and integrations specified
5. **Test & Validate** - Run build, check for errors, test functionality
6. **Update Tracking** - Mark phase as complete in tracking tables
7. **Commit Progress** - Commit changes with clear message
8. **Repeat for Next Phase** - Continue with next phase in sequence

### Development Guidelines
- **No Placeholders**: Every component must be fully functional
- **No Mock Data**: Use real database queries and API calls
- **Advanced Implementation**: Use modern patterns (Zustand, React Query, TypeScript strict mode)
- **Complete Integration**: Connect all parts (frontend ↔ backend ↔ database)
- **Error Handling**: Implement proper try-catch, loading states, error messages
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Security First**: Input validation, authentication checks, SQL injection prevention
- **Performance**: Code splitting, lazy loading, optimistic updates

### Session Goals
**Complete 2 Phases Per Session**:
- Phase 1: Full implementation + testing (30-45 min)
- Phase 2: Full implementation + testing (30-45 min)
- Total: 60-90 minutes per session

### Quality Checklist (Every Phase)
- [ ] All files created/modified as specified
- [ ] TypeScript strict mode with no errors
- [ ] Build passes (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Components render without errors
- [ ] Database queries work correctly
- [ ] API endpoints return expected data
- [ ] UI is responsive (mobile + desktop)
- [ ] Loading states implemented
- [ ] Error handling implemented
- [ ] User feedback (toasts/alerts) working

---

## 📊 CURRENT STATUS - TRACKING DASHBOARD

### Overall Progress
**Completion: 47%** (Updated: 2025-11-22 21:00 UTC)

| Category | Completed | Total | Percentage | Status |
|----------|-----------|-------|------------|--------|
| **Database Models** | 12 | 12 | 100% | ✅ Complete |
| **Authentication** | 3 | 3 | 100% | ✅ Complete |
| **API Routes** | 10 | 17 | 59% | 🟡 In Progress |
| **Public Pages** | 12 | 15 | 80% | 🟡 In Progress |
| **Admin Pages** | 5 | 26 | 19% | 🔴 Needs Work |
| **Admin Components** | 8 | 101 | 8% | 🔴 Needs Work |
| **Cart System** | 10 | 10 | 100% | ✅ Complete (NEW) |
| **Checkout Flow** | 0 | 6 | 0% | ⚪ Not Started |
| **Payment Integration** | 0 | 5 | 0% | ⚪ Not Started |
| **Email System** | 0 | 8 | 0% | ⚪ Not Started |
| **File Upload** | 0 | 12 | 0% | ⚪ Not Started |
| **Booking Calendar** | 0 | 10 | 0% | ⚪ Not Started |
| **Blockchain UI** | 0 | 12 | 0% | ⚪ Not Started |
| **Search System** | 0 | 8 | 0% | ⚪ Not Started |
| **Analytics** | 0 | 15 | 0% | ⚪ Not Started |

### Critical Path (Must Complete First)
1. ✅ **Shopping Cart** - COMPLETE (PR #8, Phase 1)
2. 🔴 **Checkout Flow** - NEXT (PR #8, Phase 2)
3. 🔴 **Payment Gateway** - (PR #8, Phase 3)
4. 🔴 **Order Processing** - (PR #8, Phase 4)
5. 🔴 **Email Notifications** - (PR #8, Phase 5)
6. 🔴 **File Upload System** - (PR #11, Phase 1-3)

---

## 🗺️ 12 PR IMPLEMENTATION ROADMAP

### PR #8: E-Commerce Completion ⚡ IN PROGRESS
**Goal**: Functional marketplace with payments  
**Duration**: 5-7 days  
**Status**: Phase 1 Complete (1/6 phases)  
**Dependencies**: ✅ Database, Auth

#### ✅ Phase 1: Shopping Cart System - COMPLETE
**Status**: ✅ Implemented (2025-11-22)  
**Duration**: 45 minutes  
**Completion**: 100%

**Files Created** (10 files, ~600 LOC):
- ✅ `lib/cart/types.ts` - TypeScript interfaces
- ✅ `lib/cart/store.ts` - Zustand store with persistence
- ✅ `lib/cart/utils.ts` - Helper functions (formatCurrency, calculateSummary)
- ✅ `components/cart/CartItem.tsx` - Cart item component
- ✅ `components/cart/CartSummary.tsx` - Order summary
- ✅ `components/cart/EmptyCart.tsx` - Empty state
- ✅ `components/cart/CartDrawer.tsx` - Slide-out cart panel
- ✅ `components/cart/CartButton.tsx` - Header cart button with badge
- ✅ `components/cart/AddToCartButton.tsx` - Add to cart button
- ✅ `app/cart/page.tsx` - Full cart page

**Files Modified** (2 files):
- ✅ `components/Header.tsx` - Added CartButton
- ✅ `app/layout.tsx` - Added CartDrawer

**Dependencies Installed**:
- ✅ `zustand@4.5.0` - State management

**Features Implemented**:
- ✅ Add items to cart (auto-increment if exists)
- ✅ Remove items from cart
- ✅ Update quantities (+/- buttons)
- ✅ Clear entire cart
- ✅ Persistent storage (localStorage)
- ✅ Real-time item count badge
- ✅ Cart drawer toggle
- ✅ Subtotal, shipping, tax, total calculations
- ✅ Free shipping threshold (₹500)
- ✅ Empty cart state
- ✅ Responsive design

**Testing**:
- ✅ Build: 48/48 pages compiled
- ✅ TypeScript: No errors
- ✅ ESLint: Passed
- ✅ Functionality: All features working

---

#### 🔴 Phase 2: Checkout Flow - NEXT TO IMPLEMENT
**Status**: ⚪ Not Started  
**Duration**: 60 minutes (estimated)  
**Priority**: CRITICAL - Blocking payment integration

**What to Build**: Multi-step checkout process with form validation

**Files to Create** (8 files, ~800 LOC):

1. **`lib/checkout/types.ts`** - TypeScript interfaces
```typescript
// Checkout types and interfaces
export interface CheckoutStep {
  id: number
  name: string
  title: string
  description: string
  isComplete: boolean
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
  isDefault?: boolean
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
```

2. **`lib/checkout/store.ts`** - Zustand checkout store
```typescript
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CheckoutState, CheckoutFormData } from './types'

interface CheckoutStore extends CheckoutState {
  // Navigation
  goToStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void
  
  // Data management
  updateFormData: (data: Partial<CheckoutFormData>) => void
  updateShipping: (shipping: Partial<ShippingAddress>) => void
  updateBilling: (billing: Partial<BillingAddress>) => void
  
  // Validation
  validateStep: (step: number) => boolean
  setErrors: (errors: Record<string, string>) => void
  clearErrors: () => void
  
  // Processing
  setProcessing: (isProcessing: boolean) => void
  resetCheckout: () => void
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 1,
      formData: {},
      isProcessing: false,
      errors: {},

      // Navigation actions
      goToStep: (step) => {
        set({ currentStep: step })
      },

      nextStep: () => {
        const { currentStep } = get()
        if (currentStep < 4) {
          set({ currentStep: currentStep + 1 })
        }
      },

      previousStep: () => {
        const { currentStep } = get()
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 })
        }
      },

      // Data management
      updateFormData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data }
        }))
      },

      updateShipping: (shipping) => {
        set((state) => ({
          formData: {
            ...state.formData,
            shipping: { ...state.formData.shipping, ...shipping } as ShippingAddress
          }
        }))
      },

      updateBilling: (billing) => {
        set((state) => ({
          formData: {
            ...state.formData,
            billing: { ...state.formData.billing, ...billing } as BillingAddress
          }
        }))
      },

      // Validation
      validateStep: (step) => {
        const { formData } = get()
        const errors: Record<string, string> = {}

        // Step 1: Shipping validation
        if (step === 1) {
          if (!formData.shipping?.fullName) errors.fullName = 'Full name is required'
          if (!formData.shipping?.phone) errors.phone = 'Phone number is required'
          if (!formData.shipping?.email) errors.email = 'Email is required'
          if (!formData.shipping?.address) errors.address = 'Address is required'
          if (!formData.shipping?.city) errors.city = 'City is required'
          if (!formData.shipping?.state) errors.state = 'State is required'
          if (!formData.shipping?.postalCode) errors.postalCode = 'Postal code is required'
        }

        // Step 2: Billing validation (if different from shipping)
        if (step === 2 && !formData.billing?.sameAsShipping) {
          if (!formData.billing?.fullName) errors.billingFullName = 'Billing name is required'
          if (!formData.billing?.address) errors.billingAddress = 'Billing address is required'
        }

        // Step 3: Review validation
        if (step === 3) {
          if (!formData.termsAccepted) errors.terms = 'You must accept terms and conditions'
        }

        set({ errors })
        return Object.keys(errors).length === 0
      },

      setErrors: (errors) => {
        set({ errors })
      },

      clearErrors: () => {
        set({ errors: {} })
      },

      // Processing
      setProcessing: (isProcessing) => {
        set({ isProcessing })
      },

      resetCheckout: () => {
        set({
          currentStep: 1,
          formData: {},
          isProcessing: false,
          errors: {}
        })
      }
    }),
    {
      name: 'damday-checkout-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep
      })
    }
  )
)
```

3. **`lib/checkout/utils.ts`** - Helper functions
```typescript
import type { ShippingAddress, BillingAddress } from './types'

export const CHECKOUT_STEPS = [
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
```

4. **`components/checkout/StepIndicator.tsx`** - Progress indicator
```typescript
'use client'

import { CheckIcon } from '@heroicons/react/24/solid'
import { CHECKOUT_STEPS } from '@/lib/checkout/utils'
import { useCheckoutStore } from '@/lib/checkout/store'

export function StepIndicator() {
  const currentStep = useCheckoutStore((state) => state.currentStep)

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-center space-x-5">
        {CHECKOUT_STEPS.map((step) => (
          <li key={step.id} className="relative">
            {currentStep > step.id ? (
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
                  <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
              </div>
            ) : currentStep === step.id ? (
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-600 bg-white">
                  <span className="text-green-600 font-semibold">{step.id}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                  <span className="text-gray-500">{step.id}</span>
                </div>
              </div>
            )}
            {step.id !== CHECKOUT_STEPS.length && (
              <div className={`absolute top-5 left-10 w-16 h-0.5 ${
                currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            )}
          </li>
        ))}
      </ol>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-medium text-gray-900">
          {CHECKOUT_STEPS[currentStep - 1].title}
        </h3>
        <p className="text-sm text-gray-500">
          {CHECKOUT_STEPS[currentStep - 1].description}
        </p>
      </div>
    </nav>
  )
}
```

5. **`components/checkout/ShippingForm.tsx`** - Shipping address form
```typescript
'use client'

import { useState } from 'react'
import { useCheckoutStore } from '@/lib/checkout/store'
import { validateEmail, validatePhone, validatePostalCode } from '@/lib/checkout/utils'

export function ShippingForm() {
  const { formData, updateShipping, errors, validateStep, nextStep } = useCheckoutStore()
  const shipping = formData.shipping || {}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(1)) {
      nextStep()
    }
  }

  const handleChange = (field: string, value: string) => {
    updateShipping({ [field]: value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            value={shipping.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            value={shipping.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="9876543210"
            required
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={shipping.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Street Address *
          </label>
          <input
            type="text"
            id="address"
            value={shipping.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <input
            type="text"
            id="city"
            value={shipping.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State *
          </label>
          <input
            type="text"
            id="state"
            value={shipping.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state}</p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
            Postal Code *
          </label>
          <input
            type="text"
            id="postalCode"
            value={shipping.postalCode || ''}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            maxLength={6}
            placeholder="110001"
            required
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            id="country"
            value="India"
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
          />
        </div>
      </div>

      {/* Save Address Checkbox */}
      <div className="flex items-center">
        <input
          id="saveAddress"
          type="checkbox"
          checked={formData.saveAddress || false}
          onChange={(e) => updateShipping({ saveAddress: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="saveAddress" className="ml-2 block text-sm text-gray-900">
          Save this address for future purchases
        </label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Continue to Billing
        </button>
      </div>
    </form>
  )
}
```

6. **`components/checkout/BillingForm.tsx`** - Billing address form
```typescript
'use client'

import { useCheckoutStore } from '@/lib/checkout/store'

export function BillingForm() {
  const { formData, updateBilling, nextStep, previousStep, errors, validateStep } = useCheckoutStore()
  const billing = formData.billing || {}
  const sameAsShipping = billing.sameAsShipping !== false // default true

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(2)) {
      nextStep()
    }
  }

  const handleSameAsShippingChange = (checked: boolean) => {
    if (checked) {
      // Copy shipping to billing
      updateBilling({
        ...formData.shipping,
        sameAsShipping: true
      })
    } else {
      updateBilling({ sameAsShipping: false })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Same as Shipping Checkbox */}
      <div className="flex items-center">
        <input
          id="sameAsShipping"
          type="checkbox"
          checked={sameAsShipping}
          onChange={(e) => handleSameAsShippingChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="sameAsShipping" className="ml-2 block text-sm text-gray-900">
          Billing address is same as shipping address
        </label>
      </div>

      {/* Billing Form (show only if different from shipping) */}
      {!sameAsShipping && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Similar fields as ShippingForm */}
          <div>
            <label htmlFor="billingFullName" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              id="billingFullName"
              value={billing.fullName || ''}
              onChange={(e) => updateBilling({ fullName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="billingPhone" className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              id="billingPhone"
              value={billing.phone || ''}
              onChange={(e) => updateBilling({ phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700">
              Street Address *
            </label>
            <input
              type="text"
              id="billingAddress"
              value={billing.address || ''}
              onChange={(e) => updateBilling({ address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          {/* Add city, state, postalCode fields similarly */}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={previousStep}
          className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Back to Shipping
        </button>
        <button
          type="submit"
          className="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Continue to Review
        </button>
      </div>
    </form>
  )
}
```

7. **`components/checkout/OrderReview.tsx`** - Order review component
```typescript
'use client'

import Image from 'next/image'
import { useCartStore } from '@/lib/cart/store'
import { useCheckoutStore } from '@/lib/checkout/store'
import { formatCurrency } from '@/lib/cart/utils'
import { calculateCartSummary } from '@/lib/cart/utils'

export function OrderReview() {
  const { items } = useCartStore()
  const { formData, updateFormData, nextStep, previousStep, errors } = useCheckoutStore()
  const summary = calculateCartSummary(items)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.termsAccepted) {
      nextStep() // Go to payment
    }
  }

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4">
              <div className="relative h-16 w-16 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
        <div className="text-sm text-gray-600">
          <p className="font-medium text-gray-900">{formData.shipping?.fullName}</p>
          <p>{formData.shipping?.address}</p>
          <p>{formData.shipping?.city}, {formData.shipping?.state} {formData.shipping?.postalCode}</p>
          <p>{formData.shipping?.country || 'India'}</p>
          <p className="mt-2">Phone: {formData.shipping?.phone}</p>
          <p>Email: {formData.shipping?.email}</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Subtotal</dt>
            <dd className="font-medium text-gray-900">{formatCurrency(summary.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Shipping</dt>
            <dd className="font-medium text-gray-900">
              {summary.shipping === 0 ? 'FREE' : formatCurrency(summary.shipping)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Tax (5%)</dt>
            <dd className="font-medium text-gray-900">{formatCurrency(summary.tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <dt className="text-base font-medium text-gray-900">Total</dt>
            <dd className="text-base font-medium text-gray-900">{formatCurrency(summary.total)}</dd>
          </div>
        </dl>
      </div>

      {/* Terms and Conditions */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            checked={formData.termsAccepted || false}
            onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I accept the{' '}
            <a href="/terms" className="text-green-600 hover:text-green-700 underline">
              terms and conditions
            </a>
            {' '}and{' '}
            <a href="/privacy" className="text-green-600 hover:text-green-700 underline">
              privacy policy
            </a>
          </label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-600">{errors.terms}</p>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={previousStep}
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Back to Billing
          </button>
          <button
            type="submit"
            className="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  )
}
```

8. **`app/checkout/page.tsx`** - Main checkout page
```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart/store'
import { useCheckoutStore } from '@/lib/checkout/store'
import { StepIndicator } from '@/components/checkout/StepIndicator'
import { ShippingForm } from '@/components/checkout/ShippingForm'
import { BillingForm } from '@/components/checkout/BillingForm'
import { OrderReview } from '@/components/checkout/OrderReview'

export default function CheckoutPage() {
  const router = useRouter()
  const { items } = useCartStore()
  const currentStep = useCheckoutStore((state) => state.currentStep)

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  if (items.length === 0) {
    return null // or loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">
            Complete your purchase in a few simple steps
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator />
        </div>

        {/* Step Content */}
        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          {currentStep === 1 && <ShippingForm />}
          {currentStep === 2 && <BillingForm />}
          {currentStep === 3 && <OrderReview />}
          {currentStep === 4 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                Payment integration will be implemented in Phase 3
              </p>
            </div>
          )}
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center text-sm text-gray-500">
          <svg className="mr-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure checkout powered by Damday Village
        </div>
      </div>
    </div>
  )
}
```

**Files to Modify** (1 file):

1. **`components/cart/CartSummary.tsx`** - Add checkout button
```typescript
// Add this button at the bottom of CartSummary component
<Link
  href="/checkout"
  className="w-full rounded-md bg-green-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
>
  Proceed to Checkout
</Link>
```

**Dependencies** (already installed):
- ✅ `@heroicons/react` - For icons

**Testing Checklist**:
- [ ] Navigate through all 4 steps
- [ ] Validate required fields
- [ ] Test form data persistence (localStorage)
- [ ] Test "same as shipping" toggle
- [ ] Verify address validation
- [ ] Check responsive design on mobile
- [ ] Test back/forward navigation
- [ ] Verify order summary calculations
- [ ] Test terms acceptance requirement
- [ ] Build passes without errors

**Success Criteria**:
- ✅ 4-step checkout flow fully functional
- ✅ Form validation working on all steps
- ✅ Data persists across page refreshes
- ✅ Mobile responsive design
- ✅ Order summary displays correctly
- ✅ Navigation between steps works smoothly
- ✅ Can't proceed without required fields
- ✅ Terms must be accepted before payment
- ✅ All TypeScript types defined
- ✅ Build successful

**What Happens After**:
- Phase 3 will integrate Razorpay payment gateway
- Phase 4 will implement order creation in database
- Phase 5 will send email confirmations

---

#### 🔴 Phase 3: Payment Integration (Razorpay) - UPCOMING
**Status**: ⚪ Not Started  
**Duration**: 90 minutes (estimated)  
**Dependencies**: Phase 2 (Checkout Flow)

**What to Build**: Razorpay payment gateway integration

**Files to Create**:
1. `lib/payment/razorpay.ts` - Razorpay client configuration
2. `lib/payment/types.ts` - Payment types
3. `app/api/payment/create-order/route.ts` - Create Razorpay order
4. `app/api/payment/verify/route.ts` - Verify payment signature
5. `components/checkout/PaymentForm.tsx` - Payment UI
6. `components/checkout/PaymentMethods.tsx` - Payment method selector

**Dependencies to Install**:
- `razorpay` - Razorpay Node.js SDK
- Need Razorpay API keys (test mode)

**Environment Variables Required**:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

---

#### 🔴 Phase 4: Order Processing - UPCOMING
**Status**: ⚪ Not Started  
**Duration**: 60 minutes  
**Dependencies**: Phase 3 (Payment Integration)

**What to Build**: Complete order creation and processing

**Files to Create**:
1. `app/api/orders/create/route.ts` - Create order in database
2. `app/api/orders/[id]/route.ts` - Get/update order
3. `app/orders/page.tsx` - User orders list
4. `app/orders/[id]/page.tsx` - Order details page
5. `components/orders/OrderCard.tsx` - Order card component
6. `components/orders/OrderStatus.tsx` - Order status badge

**Database Operations**:
- Insert into Order table
- Insert into OrderItem table (for each cart item)
- Update Product stock quantities
- Clear user's cart after successful order

---

#### 🔴 Phase 5: Email Notifications - UPCOMING
**Status**: ⚪ Not Started  
**Duration**: 60 minutes  
**Dependencies**: Phase 4 (Order Processing)

**What to Build**: Email notification system

**Files to Create**:
1. `lib/email/client.ts` - Email service client (Nodemailer/Resend)
2. `lib/email/templates/order-confirmation.tsx` - Order confirmation email
3. `lib/email/templates/shipping-update.tsx` - Shipping notification
4. `app/api/email/send/route.ts` - Send email API

**Dependencies to Install**:
- `nodemailer` or `resend` - Email service
- `@react-email/components` - Email templates

---

#### 🔴 Phase 6: Testing & Optimization - UPCOMING
**Status**: ⚪ Not Started  
**Duration**: 45 minutes  
**Dependencies**: Phases 1-5

**What to Test**:
- End-to-end checkout flow
- Payment processing
- Order creation
- Email delivery
- Error scenarios (payment failure, network issues)
- Mobile responsiveness
- Performance optimization

---

### PR #9: Homestay Booking Completion
**Goal**: Functional booking system with calendar  
**Duration**: 4-6 days  
**Status**: ⚪ Not Started  
**Dependencies**: ✅ Database, Auth, ⏳ PR #8 (Payment)

**Phases**:
1. Booking Calendar UI (availability display)
2. Date Range Selection
3. Guest Information Form
4. Payment Integration (reuse from PR #8)
5. Booking Confirmation
6. Booking Management (user dashboard)

---

### PR #10: Admin Panel Core Functions
**Goal**: Make 90+ placeholder components functional  
**Duration**: 6-8 days  
**Status**: ⚪ Not Started  
**Dependencies**: ✅ Database, Auth

**Critical Components to Implement**:
- Product management (CRUD operations)
- Order management (view, update status)
- User management (view, edit, ban)
- Dashboard analytics (real data)
- Media upload (image management)

---

### PR #11: File Upload & Media System
**Goal**: Image upload functionality  
**Duration**: 3-4 days  
**Status**: ⚪ Not Started  

**Phases**:
1. Local file upload (Next.js API route)
2. Image optimization (Sharp library)
3. Media library UI
4. Cloud storage (optional S3 integration)

---

### PR #12: DamChain Blockchain UI
**Goal**: Connect blockchain to user interface  
**Duration**: 5-7 days  
**Status**: ⚪ Not Started  

**Phases**:
1. Wallet connection (MetaMask integration)
2. Tree NFT minting interface
3. Carbon credit trading UI
4. Transaction history
5. Admin blockchain panel
6. Blockchain explorer

---

### PR #13-19: Additional Features
- **PR #13**: Search & Filtering
- **PR #14**: Blog & CMS Enhancement
- **PR #15**: Notifications & Real-time
- **PR #16**: Tour Management
- **PR #17**: Security & Performance
- **PR #18**: Mobile Responsiveness
- **PR #19**: Analytics & Reporting

---

## 📈 DETAILED TRACKING TABLES

### Component Implementation Status

#### Cart System (PR #8, Phase 1) ✅ COMPLETE
| Component | Path | Status | LOC | Notes |
|-----------|------|--------|-----|-------|
| CartItem | `components/cart/CartItem.tsx` | ✅ Done | 75 | Quantity controls working |
| CartSummary | `components/cart/CartSummary.tsx` | ✅ Done | 65 | Calculations correct |
| EmptyCart | `components/cart/EmptyCart.tsx` | ✅ Done | 35 | CTA button functional |
| CartDrawer | `components/cart/CartDrawer.tsx` | ✅ Done | 120 | Slide animation working |
| CartButton | `components/cart/CartButton.tsx` | ✅ Done | 55 | Badge updates in real-time |
| AddToCartButton | `components/cart/AddToCartButton.tsx` | ✅ Done | 45 | Product integration working |
| Cart Store | `lib/cart/store.ts` | ✅ Done | 110 | Zustand + persistence |
| Cart Types | `lib/cart/types.ts` | ✅ Done | 30 | TypeScript interfaces |
| Cart Utils | `lib/cart/utils.ts` | ✅ Done | 45 | Helper functions |
| Cart Page | `app/cart/page.tsx` | ✅ Done | 80 | Full page view |

**Total**: 10/10 components | 660 LOC | 100% Complete

#### Checkout Flow (PR #8, Phase 2) ⚪ NOT STARTED
| Component | Path | Status | Est. LOC | Priority |
|-----------|------|--------|----------|----------|
| StepIndicator | `components/checkout/StepIndicator.tsx` | ⚪ TODO | 80 | High |
| ShippingForm | `components/checkout/ShippingForm.tsx` | ⚪ TODO | 150 | Critical |
| BillingForm | `components/checkout/BillingForm.tsx` | ⚪ TODO | 130 | Critical |
| OrderReview | `components/checkout/OrderReview.tsx` | ⚪ TODO | 140 | High |
| Checkout Store | `lib/checkout/store.ts` | ⚪ TODO | 180 | Critical |
| Checkout Types | `lib/checkout/types.ts` | ⚪ TODO | 60 | Critical |
| Checkout Utils | `lib/checkout/utils.ts` | ⚪ TODO | 70 | Medium |
| Checkout Page | `app/checkout/page.tsx` | ⚪ TODO | 120 | Critical |

**Total**: 0/8 components | ~930 LOC | 0% Complete

---

### API Routes Status

| Route | Path | Status | Method | Auth | Purpose |
|-------|------|--------|--------|------|---------|
| Health | `/api/health` | ✅ Done | GET | No | Health check |
| Auth | `/api/auth/[...nextauth]` | ✅ Done | * | No | NextAuth handler |
| Register | `/api/auth/register` | ✅ Done | POST | No | User registration |
| Profile | `/api/user/profile` | ✅ Done | GET/PUT | Yes | User profile |
| Products List | `/api/admin/products` | ✅ Done | GET | Yes | Product listing |
| Product CRUD | `/api/admin/products/[id]` | 🟡 Partial | GET/PUT/DELETE | Yes | Missing PUT/DELETE |
| Homestays | `/api/admin/homestays` | 🟡 Partial | GET | Yes | Missing POST/PUT |
| Tours | `/api/admin/tours` | 🟡 Partial | GET | Yes | Missing POST/PUT |
| Blog | `/api/admin/blog` | 🟡 Partial | GET | Yes | Missing POST/PUT |
| Bookings | `/api/bookings` | ⚪ TODO | * | Yes | Not implemented |
| Orders | `/api/orders` | ⚪ TODO | * | Yes | Not implemented |
| Payment | `/api/payment/*` | ⚪ TODO | * | Yes | Not implemented |
| Upload | `/api/upload` | ⚪ TODO | POST | Yes | Not implemented |
| Search | `/api/search` | ⚪ TODO | GET | No | Not implemented |
| Email | `/api/email/*` | ⚪ TODO | POST | Yes | Not implemented |
| Blockchain | `/api/blockchain/*` | ⚪ TODO | * | Yes | Not implemented |

**Total**: 6/17 complete, 4/17 partial, 7/17 not started

---

### Admin Components Status (90% are placeholders)

| Category | Components | Functional | Placeholders | Status |
|----------|------------|------------|--------------|--------|
| Dashboard | 5 | 1 | 4 | 20% |
| Products | 10 | 1 | 9 | 10% |
| Orders | 5 | 0 | 5 | 0% |
| Homestays | 12 | 1 | 11 | 8% |
| Tours | 5 | 0 | 5 | 0% |
| Blog | 12 | 1 | 11 | 8% |
| Users | 10 | 1 | 9 | 10% |
| Analytics | 12 | 1 | 11 | 8% |
| Settings | 15 | 1 | 14 | 7% |
| Marketing | 6 | 0 | 6 | 0% |
| UX | 8 | 1 | 7 | 13% |
| Developer | 5 | 0 | 5 | 0% |
| **TOTAL** | **101** | **8** | **93** | **8%** |

---

### Database Integration Status

| Model | CRUD | Seed Data | Relations | Validation | Status |
|-------|------|-----------|-----------|------------|--------|
| User | ✅ | ✅ | ✅ | ✅ | 100% |
| Profile | ✅ | ✅ | ✅ | ✅ | 100% |
| Settings | ✅ | ✅ | ⚪ | ⚪ | 50% |
| NavItem | ✅ | ✅ | ⚪ | ⚪ | 50% |
| Category | ✅ | ✅ | ✅ | ⚪ | 75% |
| Product | 🟡 | ✅ | ✅ | ⚪ | 75% |
| Order | ⚪ | ⚪ | ⚪ | ⚪ | 0% |
| OrderItem | ⚪ | ⚪ | ⚪ | ⚪ | 0% |
| Homestay | 🟡 | ✅ | ✅ | ⚪ | 75% |
| Tour | 🟡 | ✅ | ✅ | ⚪ | 75% |
| Booking | ⚪ | ⚪ | ⚪ | ⚪ | 0% |
| Post | 🟡 | ✅ | ✅ | ⚪ | 75% |

**Average**: 55% complete

---

### Feature Implementation Checklist

#### E-Commerce Features
- [x] Product listing page
- [x] Product detail page
- [x] Category filtering
- [x] Shopping cart (NEW)
- [ ] Checkout flow
- [ ] Payment processing
- [ ] Order creation
- [ ] Order tracking
- [ ] Email confirmations
- [ ] Product reviews
- [ ] Wishlist
- [ ] Product search

#### Booking Features
- [x] Homestay listing
- [x] Tour listing
- [x] Property details
- [ ] Availability calendar
- [ ] Date selection
- [ ] Booking form
- [ ] Payment integration
- [ ] Booking confirmation
- [ ] Cancellation system
- [ ] Review system

#### Admin Features
- [x] Dashboard (basic)
- [ ] Product management
- [ ] Order management
- [ ] Booking management
- [ ] User management
- [ ] Content management
- [ ] Analytics (real data)
- [ ] Reports generation
- [ ] Settings management

#### Blockchain Features
- [x] Core implementation
- [ ] Wallet connection
- [ ] NFT minting UI
- [ ] Trading interface
- [ ] Transaction history
- [ ] Admin panel
- [ ] Carbon credit system
- [ ] Verification system

---

## 🚀 NEXT STEPS (Immediate Actions)

### Current Session - Phase 2 Implementation
**Implement PR #8, Phase 2: Checkout Flow**

1. **Create checkout infrastructure** (30 min)
   - Set up `lib/checkout/` directory
   - Create types, store, utils files
   - Configure Zustand store with persistence

2. **Build checkout components** (30 min)
   - StepIndicator component
   - ShippingForm with validation
   - BillingForm with "same as shipping"
   - OrderReview component

3. **Create checkout page** (15 min)
   - Set up routing
   - Integrate components
   - Add navigation logic
   - Test full flow

4. **Testing & validation** (15 min)
   - Test all 4 steps
   - Verify form validation
   - Check data persistence
   - Test responsive design
   - Run build

**Total Time**: 90 minutes  
**Expected Output**: Fully functional checkout flow ready for payment integration

---

## 📝 DEVELOPMENT NOTES

### Completed Work Log

**2025-11-22 21:00 UTC - PR #8 Phase 1 Complete**
- Implemented complete shopping cart system
- Added Zustand state management with persistence
- Created 10 new components
- Modified Header and Layout for cart integration
- Build passing: 48/48 pages
- All cart features fully functional
- Ready for Phase 2 (Checkout Flow)

### Known Issues
1. Admin components are mostly placeholders (8% functional)
2. No payment integration yet (Phase 3)
3. No email system (Phase 5)
4. File upload not implemented (PR #11)
5. Blockchain UI not connected (PR #12)

### Technical Debt
- Need to add unit tests for cart system
- Need to optimize cart state updates
- Consider implementing cart abandonment tracking
- Add analytics events for cart interactions

---

## 🎯 SUCCESS METRICS

### Phase Completion Criteria
Each phase must meet these criteria before marking as complete:

1. **Code Quality**
   - ✅ TypeScript strict mode (no `any` types)
   - ✅ ESLint passing (no warnings)
   - ✅ Build successful
   - ✅ No console errors

2. **Functionality**
   - ✅ All specified features working
   - ✅ Database integration complete
   - ✅ API endpoints functional
   - ✅ Error handling implemented

3. **User Experience**
   - ✅ Responsive design (mobile + desktop)
   - ✅ Loading states
   - ✅ Error messages
   - ✅ Success feedback

4. **Testing**
   - ✅ Manual testing complete
   - ✅ Edge cases covered
   - ✅ Error scenarios handled
   - ✅ User flows validated

### Final Goal (12 PRs Complete)
- **E-commerce**: Fully functional marketplace with payments
- **Bookings**: Working homestay and tour booking system
- **Admin**: 100% functional admin panel
- **Blockchain**: User-facing blockchain features
- **Performance**: Fast, optimized, production-ready
- **Security**: Secure, validated, protected
- **Mobile**: Fully responsive across all devices
- **Analytics**: Real-time data and insights

---

## 📚 REFERENCE INFORMATION

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand (shopping cart, checkout)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (JWT)
- **Payments**: Razorpay (to be implemented)
- **Email**: Nodemailer/Resend (to be implemented)
- **Blockchain**: Custom DamChain implementation
- **Deployment**: Vercel/Railway

### File Structure
```
/app                  - Next.js 14 app directory
  /api               - API routes (17 endpoints)
  /cart              - Cart page ✅
  /checkout          - Checkout page (TODO)
  /admin             - Admin panel (26 pages)
  /(public)          - Public pages
/components
  /cart              - Cart components (6 files) ✅
  /checkout          - Checkout components (TODO)
  /admin             - Admin components (101 files, 8% functional)
/lib
  /cart              - Cart logic ✅
  /checkout          - Checkout logic (TODO)
  /payment           - Payment integration (TODO)
  /email             - Email service (TODO)
/prisma
  schema.prisma      - Database schema (12 models)
```

### Environment Variables Required
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Payment (TODO)
RAZORPAY_KEY_ID="..."
RAZORPAY_KEY_SECRET="..."

# Email (TODO)
SMTP_HOST="..."
SMTP_PORT="..."
SMTP_USER="..."
SMTP_PASS="..."
```

---

**END OF DELTA.MD**

**Remember**: This is a living document. Update tracking tables after each phase completion. Follow the autonomous development protocol for consistent, high-quality implementation. Always implement complete, functional features—no placeholders!
