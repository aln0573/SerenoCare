import React from 'react'
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/solid'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className="bg-white border-t pt-12 pb-6 px-6 md:px-16 lg:px-24">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-gray-700">
        
        {/* --- Left Section --- */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            
            <span className="text-lg font-bold text-red-700">SerenoCare</span>
          </div>
          <p className='text-sm leading-relaxed'>
            SerenoCare is committed to providing top-notch healthcare services through a verified list of doctors.
            Book your appointment today and experience seamless healthcare access.
          </p>
        </div>

        {/* --- Center Section: Quick Links --- */}
        <div>
          <h3 className="font-semibold text-red-700 mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-red-700">Home</a></li>
            <li><a href="/doctors" className="hover:text-red-700">All Doctors</a></li>
            <li><a href="/about" className="hover:text-red-700">About</a></li>
            <li><a href="/contact" className="hover:text-red-700">Contact</a></li>
          </ul>
        </div>

        {/* --- Right Section: Contact --- */}
        <div>
          <h3 className="font-semibold text-red-700 mb-3">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPinIcon className="w-5 h-5 text-red-600" />
              <span>Kerala, Kozhikode, India</span>
            </li>
            <li className="flex items-start gap-2">
              <PhoneIcon className="w-5 h-5 text-red-600" />
              <span>+91 6238530573</span>
            </li>
            <li className="flex items-start gap-2">
              <EnvelopeIcon className="w-5 h-5 text-red-600" />
              <span>support@serenocare.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="border-t text-center text-xs text-gray-500 mt-8 pt-4">
        &copy; {new Date().getFullYear()} SerenoCare. All rights reserved.
      </div>
    </div>
  )
}

export default Footer
