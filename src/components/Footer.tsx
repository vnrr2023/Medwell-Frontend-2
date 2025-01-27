import React from "react"
import Link from "next/link"
import { Heart, Activity, FileText, DollarSign, Github, Linkedin, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F5] text-[#212121] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-[#0078D7]">Med</span>
              <span className="text-[#00C6D7]">Well</span>
            </h3>
            <p className="text-sm mb-4">Empowering health, one patient at a time.</p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/medwell"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0078D7] hover:text-[#00C6D7]"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com/company/medwell"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0078D7] hover:text-[#00C6D7]"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", link: "/", icon: Heart },
                { name: "Dashboard", link: "/Dashboard", icon: Activity },
                { name: "Pricing", link: "/pricing", icon: DollarSign },
                { name: "About", link: "/about", icon: FileText },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.link} className="flex items-center text-[#212121] hover:text-[#0078D7]">
                    <link.icon className="h-4 w-4 mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-[#0078D7]" />
                <a href="mailto:csgptmail@gmail.com" className="text-[#212121] hover:text-[#0078D7]">
                  csgptmail@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-[#0078D7]" />
                <a href="tel:+91 98923 62829" className="text-[#212121] hover:text-[#0078D7]">
                  +91 98923 62829
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-4">Stay updated with our latest health tips and news.</p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Your email" className="flex-grow" />
              <Button type="submit" className="bg-[#0078D7] hover:bg-[#00C6D7] text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#0078D7]/20 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} MedWell. All rights reserved.</p>
          <p className="text-xs mt-2">&quot;My health is Mine.&quot; - Rohit</p>
        </div>
      </div>
    </footer>
  )
}

