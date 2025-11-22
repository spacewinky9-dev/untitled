'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CheckoutState, CheckoutFormData, ShippingAddress, BillingAddress } from './types'
import { validateShippingAddress, validateBillingAddress } from './utils'

interface CheckoutStore extends CheckoutState {
  goToStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void
  updateFormData: (data: Partial<CheckoutFormData>) => void
  updateShipping: (shipping: Partial<ShippingAddress>) => void
  updateBilling: (billing: Partial<BillingAddress>) => void
  validateStep: (step: number) => boolean
  setErrors: (errors: Record<string, string>) => void
  clearErrors: () => void
  setProcessing: (isProcessing: boolean) => void
  resetCheckout: () => void
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: {},
      isProcessing: false,
      errors: {},

      goToStep: (step) => set({ currentStep: step }),
      
      nextStep: () => {
        const { currentStep } = get()
        if (currentStep < 4) set({ currentStep: currentStep + 1 })
      },
      
      previousStep: () => {
        const { currentStep } = get()
        if (currentStep > 1) set({ currentStep: currentStep - 1 })
      },
      
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
      
      validateStep: (step) => {
        const { formData } = get()
        let errors: Record<string, string> = {}

        if (step === 1) {
          errors = validateShippingAddress(formData.shipping || {})
        } else if (step === 2) {
          errors = validateBillingAddress(formData.billing || {})
        } else if (step === 3) {
          if (!formData.termsAccepted) {
            errors.terms = 'You must accept terms and conditions'
          }
        }

        set({ errors })
        return Object.keys(errors).length === 0
      },
      
      setErrors: (errors) => set({ errors }),
      clearErrors: () => set({ errors: {} }),
      setProcessing: (isProcessing) => set({ isProcessing }),
      resetCheckout: () => set({
        currentStep: 1,
        formData: {},
        isProcessing: false,
        errors: {}
      })
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
