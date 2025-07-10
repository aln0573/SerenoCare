import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {

  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  return (
    <div className='flex flex-col items-center gap-6 my-16 text-gray-900 md:mx-10'>

      <h1 className='text-3xl font-semibold'>Top Doctors To Book</h1>
      <p className='sm:w-1/3 text-center text-sm text-gray-600'>Simply browse through our extensive list of trusted doctors.</p>

      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6'>

        {doctors.slice(0, 8).map((item, index) => (
          <div  key={index}  onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0,0)}}
            className='cursor-pointer border border-gray-200 rounded-xl overflow-hidden hover:-translate-y-2 transition-transform duration-500 shadow-sm hover:shadow-md'>
            <img className='w-full h-64 object-cover bg-gray-100' src={item.image} alt={item.name} />
            <div className='p-4'>
              <div className={`flex items-center gap-2 text-xs ${item.available ? ' text-green-600' : 'text-red-600' } mb-1`}>
                <span className={`inline-block w-2 h-2 ${item.available ?  'bg-green-500' : 'bg-red-500' } rounded-full`}></span>
                <span>{item.available ? 'Available' : 'Not Available'}</span>
              </div>
              <p className='font-semibold text-lg text-gray-900 mb-1'>{item.name}</p>
              <p className='text-sm text-gray-600'>{item.speciality}</p>
            </div>
          </div>
        ))}

      </div>

      <button 
        onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
        className='mt-8 px-8 py-2.5 bg-red-600 text-white text-sm rounded-full hover:bg-red-700 transition-colors duration-300'
      >
        More
      </button>

    </div>
  )
}

export default TopDoctors
