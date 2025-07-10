import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='px-5 md:px-20 py-16 text-gray-800 bg-white'>

      {/* Heading */}
      <div className='text-center mb-12'>
        <p className='text-4xl font-bold text-red-800'>ABOUT <span className='text-gray-700'>US</span></p>
        <div className='w-20 h-1 bg-red-800 mx-auto mt-2'></div>
      </div>

      {/* Main Section */}
      <div className='flex flex-col md:flex-row items-center gap-10'>

        {/* Image */}
        <img src={assets.about_image} alt="" className='w-full md:w-1/2 rounded-lg shadow-md' />

        {/* Content */}
        <div className='flex-1 text-lg space-y-5'>
          <p>
            Welcome to <span className='font-semibold text-red-800'>SerenoCare</span> — your reliable partner for managing healthcare with ease and efficiency.
            At SerenoCare, we understand that scheduling doctor appointments and keeping track of health records 
            can sometimes feel challenging. That’s why we’re here to make the entire process smoother and more convenient for you.
          </p>

          <p>
            We are committed to advancing healthcare technology. Our platform is continuously updated with the latest innovations 
            to enhance your experience and deliver outstanding service. Whether you're booking your first appointment or managing 
            ongoing care, SerenoCare is here to support you every step of the way.
          </p>

          <div>
            <p className='text-2xl font-bold text-red-800 mb-2'>Our Vision</p>
            <p>
              At SerenoCare, our vision is to create a seamless healthcare journey for every individual. 
              We aim to bridge the gap between patients and healthcare providers, ensuring that accessing the care 
              you need is simple, efficient, and timely.
            </p>
          </div>
        </div>

      </div>

    </div>
  )
}

export default About
