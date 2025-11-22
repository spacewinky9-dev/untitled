'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart/store'
import { useCheckoutStore } from '@/lib/checkout/store'
import { CHECKOUT_STEPS } from '@/lib/checkout/utils'
import { Check } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items } = useCartStore()
  const { currentStep, formData, updateShipping, updateBilling, updateFormData, validateStep, nextStep, previousStep, errors } = useCheckoutStore()

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  if (items.length === 0) {
    return null
  }

  const currentStepData = CHECKOUT_STEPS[currentStep - 1]

  const handleContinue = () => {
    if (validateStep(currentStep)) {
      nextStep()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">Complete your purchase</p>
        </div>

        {/* Step Indicator */}
        <nav aria-label="Progress" className="mb-8">
          <ol className="flex items-center justify-between">
            {CHECKOUT_STEPS.map((step, idx) => (
              <li key={step.id} className="relative flex-1">
                <div className={`flex items-center ${idx !== CHECKOUT_STEPS.length - 1 ? 'pr-8' : ''}`}>
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                    currentStep > step.id ? 'bg-green-600' :
                    currentStep === step.id ? 'border-2 border-green-600 bg-white' :
                    'border-2 border-gray-300 bg-white'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="h-6 w-6 text-white" />
                    ) : (
                      <span className={currentStep === step.id ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                        {step.id}
                      </span>
                    )}
                  </div>
                  {idx !== CHECKOUT_STEPS.length - 1 && (
                    <div className={`absolute top-5 left-14 h-0.5 w-full ${
                      currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 text-center">
            <h2 className="text-lg font-medium text-gray-900">{currentStepData.title}</h2>
            <p className="text-sm text-gray-500">{currentStepData.description}</p>
          </div>
        </nav>

        {/* Step Content */}
        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          {/* Step 1: Shipping */}
          {currentStep === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input type="text" value={formData.shipping?.fullName || ''} onChange={(e) => updateShipping({ fullName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
                  {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone *</label>
                  <input type="tel" value={formData.shipping?.phone || ''} onChange={(e) => updateShipping({ phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" placeholder="9876543210" required />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input type="email" value={formData.shipping?.email || ''} onChange={(e) => updateShipping({ email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address *</label>
                  <input type="text" value={formData.shipping?.address || ''} onChange={(e) => updateShipping({ address: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City *</label>
                  <input type="text" value={formData.shipping?.city || ''} onChange={(e) => updateShipping({ city: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State *</label>
                  <input type="text" value={formData.shipping?.state || ''} onChange={(e) => updateShipping({ state: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal Code *</label>
                  <input type="text" value={formData.shipping?.postalCode || ''} onChange={(e) => updateShipping({ postalCode: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" maxLength={6} placeholder="110001" required />
                  {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input type="text" value="India" disabled className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm" />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700">Continue to Billing</button>
              </div>
            </form>
          )}

          {/* Step 2: Billing */}
          {currentStep === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-6">
              <div className="flex items-center">
                <input id="sameAsShipping" type="checkbox" checked={formData.billing?.sameAsShipping !== false}
                  onChange={(e) => updateBilling({ sameAsShipping: e.target.checked, ...(e.target.checked ? formData.shipping : {}) })}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <label htmlFor="sameAsShipping" className="ml-2 block text-sm text-gray-900">Billing address same as shipping</label>
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={previousStep} className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">Back</button>
                <button type="submit" className="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700">Continue to Review</button>
              </div>
            </form>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-6">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium">Shipping Address</h3>
                  <p className="text-sm text-gray-600 mt-2">{formData.shipping?.fullName}<br/>{formData.shipping?.address}<br/>{formData.shipping?.city}, {formData.shipping?.state} {formData.shipping?.postalCode}</p>
                </div>
                <div className="flex items-start">
                  <input id="terms" type="checkbox" checked={formData.termsAccepted || false}
                    onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" required />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    I accept the <Link href="/terms" className="text-green-600 hover:underline">terms</Link> and <Link href="/privacy" className="text-green-600 hover:underline">privacy policy</Link>
                  </label>
                </div>
                {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={previousStep} className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">Back</button>
                <button type="submit" className="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700">Proceed to Payment</button>
              </div>
            </form>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Payment integration will be implemented in Phase 3</p>
              <button onClick={previousStep} className="mt-4 rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">Back to Review</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
