import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row items-center bg-red-800 rounded-lg px-6 md:px-10 lg:px-20 py-12 md:py-20">
      
      {/* Left Section */}
      <div className="md:w-1/2 text-white space-y-6">
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
          Book Your Appointment<br />With Trusted Doctors
        </h1>

        <div className="flex items-center gap-4">
          <img src={assets.group_profiles} alt="profiles" className="w-24" />
          <p className="text-sm font-light leading-relaxed">
            Browse through a curated list of verified doctors<br />
            and schedule your appointment in just a few clicks.
          </p>
        </div>

        <a href="#speciality" className="inline-flex items-center gap-2 mt-4 bg-white text-red-800 font-medium px-6 py-2 rounded-full shadow hover:scale-105 transition-all duration-300">
          Book Appointment
          <img src={assets.arrow_icon} alt="arrow" className="w-4" />
        </a>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 mt-10 md:mt-0 relative">
        <img src={assets.header_img} alt="doctor" className="w-full max-h-[500px] object-cover rounded-lg"/>
      </div>
    </div>
  )
}

export default Header
