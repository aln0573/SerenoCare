import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ docId, speciality }) => {

  const { doctors } = useContext(AppContext)
  const [relDoc, setRelDoc] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      let doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
      setRelDoc(doctorsData)
    }
  }, [doctors, docId, speciality])

  return (
    <div className='flex flex-col items-center gap-5 my-16 text-gray-900 md:mx-10'>

      <h1 className='text-3xl font-semibold'>Top Doctors To Book</h1>
      <p className='sm:w-1/3 text-center text-sm text-gray-600'>Simply browse through our extensive list of trusted doctors.</p>

      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5'>

        {relDoc.slice(0, 5).map((item, index) => (
          <div onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0,0)}} className='border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-transform duration-500 shadow-sm hover:shadow-lg' key={index}>

            <img className='w-full aspect-[4/3] sm:h-48 sm:aspect-auto object-cover bg-gray-100' src={item.image} alt={item.name} />

            <div className='p-4'>
              <div className={`flex items-center gap-2 text-xs ${item.available ? ' text-green-600' : 'text-red-600' } mb-1`}>
                <span className={`inline-block w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-red-500'}  rounded-full`}></span>
                <span>{item.available ? 'Available' : 'Not Available'}</span>
              </div>
              <p className='font-semibold text-base text-gray-900 mb-1'>{item.name}</p>
              <p className='text-sm text-gray-600'>{item.speciality}</p>
            </div>

          </div>
        ))}

      </div>

      <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='mt-6 px-6 py-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition'>See More Doctors</button>

    </div>
  )
}

export default RelatedDoctors
