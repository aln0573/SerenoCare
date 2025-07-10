import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {

  const { speciality } = useParams()
  const { doctors } = useContext(AppContext)
  const [filterDoc, setFilterDoc] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }, [doctors, speciality])

  return (
    <div className='px-6 md:px-20 py-10 text-gray-800'>
      <h2 className='text-3xl font-semibold mb-8 border-b pb-3'>Browse by Specialist</h2>

      {/* Filter buttons */}
      <div className='flex flex-wrap gap-3 mb-12'>
        {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'].map((item, index) => (
          <p key={index} onClick={() => speciality === item ? navigate('/doctors') : navigate(`/doctors/${item}`)} className={`px-5 py-2 rounded-full border text-sm font-medium cursor-pointer transition-all duration-300
            ${speciality === item ? 'bg-red-600 text-white border-red-600' : 'text-red-600 border-red-300 hover:bg-red-50'}`}>
            {item}
          </p>
        ))}
      </div>

      {/* Doctors List */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {filterDoc.length > 0 ? filterDoc.map((item, index) => (
          <div 
            key={index} onClick={() => navigate(`/appointment/${item._id}`)} className='cursor-pointer border border-gray-200 rounded-xl overflow-hidden hover:-translate-y-2 transition-transform duration-500 shadow-sm hover:shadow-md'>
            <img className='w-full h-64 object-cover bg-gray-100' src={item.image} alt={item.name} />
            <div className='p-4'>
              <div className={`flex items-center gap-2 text-xs ${item.available ? 'text-green-600' : 'text-red-600'}  mb-1`}>
                <span className={`inline-block w-2 h-2 ${item.available ?  'bg-green-500' : 'bg-red-500' } rounded-full`}></span>
                <span>{item.available ? 'Available' : 'Not Available'}</span>
              </div>
              <p className='font-semibold text-lg text-gray-900 mb-1'>{item.name}</p>
              <p className='text-sm text-gray-600'>{item.speciality}</p>
            </div>
          </div>
        )) : (
          <p className='col-span-full text-center text-gray-500 text-sm'>No doctors available in this category.</p>
        )}
      </div>

    </div>
  )
}

export default Doctors
