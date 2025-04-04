"use client"

import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function Modal({ isOpen, setIsOpen }: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    About MedWell
                  </Dialog.Title>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-4">
                    MedWell is a comprehensive healthcare platform designed to revolutionize how you manage your health.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800">Our Mission</h4>
                      <p className="text-sm text-gray-500">
                        To make healthcare accessible, understandable, and manageable for everyone through innovative
                        technology.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800">Key Benefits</h4>
                      <ul className="list-disc list-inside text-sm text-gray-500">
                        <li>Secure storage of your complete medical history</li>
                        <li>AI-powered insights and personalized recommendations</li>
                        <li>Remote consultations with healthcare providers</li>
                        <li>Easy-to-understand medical report analysis</li>
                        <li>Family health management in one account</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Got it, thanks!
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

