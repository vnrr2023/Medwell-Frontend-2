"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Loader from "@/components/Loader"

const pricingPlans = [
  {
    name: "Basic",
    description: "Essential features for individuals",
    monthlyPrice: "₹499",
    yearlyPrice: "₹4,999",
    features: [
      "Personal health record",
      "Appointment scheduling",
      "Medication reminders",
      "Basic health insights",
      "Email support",
    ],
    notIncluded: ["AI-powered diagnostics", "Family accounts", "Premium support", "Advanced analytics"],
    color: "#7C3AED",
    popular: false,
  },
  {
    name: "Pro",
    description: "Perfect for families and professionals",
    monthlyPrice: "₹999",
    yearlyPrice: "₹9,999",
    features: [
      "Everything in Basic",
      "Family accounts (up to 5)",
      "AI-powered health insights",
      "Telemedicine consultations",
      "Priority support",
      "Health trend analytics",
    ],
    notIncluded: ["Custom integrations", "Dedicated account manager"],
    color: "#EC4899",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For healthcare organizations",
    monthlyPrice: "₹2,499",
    yearlyPrice: "₹24,999",
    features: [
      "Everything in Pro",
      "Unlimited user accounts",
      "Custom integrations",
      "Advanced analytics dashboard",
      "Dedicated account manager",
      "Staff training",
      "24/7 premium support",
    ],
    notIncluded: [],
    color: "#10B981",
    popular: false,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(true)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loader onLoadingComplete={() => setLoading(false)} />
  }

  return (
    <>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              Important Notice
            </DialogTitle>
            <DialogDescription>
              The pricing information displayed on this page is for demonstration purposes only. Actual pricing may
              vary. Please contact our sales team for accurate and up-to-date pricing information.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button variant="default" onClick={() => setShowModal(false)}>
              I understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-gradient-to-b from-[#F5F0FF] to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent mb-6"
            >
              Simple, Transparent Pricing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-xl text-gray-700 max-w-3xl mx-auto"
            >
              Choose the perfect plan for your healthcare needs with no hidden fees
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex justify-center mb-12"
          >
            <Tabs
              defaultValue="monthly"
              value={billingCycle}
              onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}
              className="w-full max-w-md"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
                <TabsTrigger value="yearly">
                  Yearly Billing <span className="ml-2 text-xs text-green-600 font-medium">Save 15%</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              >
                <Card
                  className={`relative h-full border-t-4 hover:shadow-xl transition-all duration-300 ${
                    plan.popular ? "shadow-lg" : ""
                  }`}
                  style={{ borderTopColor: plan.color }}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                      <div className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        Most Popular
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl" style={{ color: plan.color }}>
                      {plan.name}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={billingCycle}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-4xl font-bold">
                            {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                          </span>
                          <span className="text-gray-500 ml-2">/ {billingCycle === "monthly" ? "month" : "year"}</span>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="space-y-3">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature) => (
                        <div key={feature} className="flex items-center text-gray-400">
                          <X className="h-5 w-5 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full text-white transition-all duration-300"
                      style={{ backgroundColor: plan.color }}
                    >
                      Get Started
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Need a custom solution?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Contact our sales team for a tailored plan that meets your specific requirements
            </p>
            <Button
              variant="outline"
              className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-all duration-300"
            >
              Contact Sales
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-16 bg-gray-50 rounded-xl p-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Can I switch plans later?</h4>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next
                  billing cycle.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Is there a free trial available?</h4>
                <p className="text-gray-600">
                  We offer a 14-day free trial for all plans. No credit card required to start.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600">
                  We accept all major credit cards, UPI, net banking, and wallet payments.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Can I get a refund if I'm not satisfied?</h4>
                <p className="text-gray-600">
                  We offer a 30-day money-back guarantee if you're not completely satisfied with our service.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
