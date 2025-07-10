import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className='px-5 md:px-20 py-16 text-gray-800 bg-white'>

      {/* Heading */}
      <div className='text-center mb-12'>
        <p className='text-4xl font-bold text-red-800'>CONTACT <span className='text-gray-700'>US</span></p>
        <div className='w-20 h-1 bg-red-800 mx-auto mt-2'></div>
      </div>

      {/* Main Section */}
      <div className='flex flex-col md:flex-row items-center gap-10'>

        {/* Image */}
        <img src={assets.contact_image} alt="Contact" className='w-full md:w-1/2 rounded-lg shadow-md' />

        {/* Contact Info */}
        <div className='flex-1 space-y-4 text-lg'>

          <div>
            <p className='text-2xl font-bold text-red-800 mb-2'>OUR OFFICE</p>
            <p className='text-gray-600'>54093 Williams Station</p>
            <p className='text-gray-600'>Ph: <a href='tel:6238530573' className='text-red-600'>6238530573</a></p>
            <p className='text-gray-600'>Email: <a href='mailto:alan8589824041@gmail.com' className='text-red-600'>alan8589824041@gmail.com</a></p>
          </div>

          <div className='pt-6'>
            <p className='text-2xl font-bold text-red-800 mb-2'>Careers at SerenoCare</p>
            <p className='text-gray-600 mb-4'>Learn more about our teams and job openings.</p>
            <button className='bg-red-800 text-white px-6 py-2 rounded-full shadow-md hover:bg-red-700 transition duration-300'>
              Explore Jobs
            </button>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Contact
