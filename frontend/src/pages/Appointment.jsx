import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {

  const { docId } = useParams()
  const { doctors, ruppesSymbol, getDoctorsData, token } = useContext(AppContext)
  const [docInfo, setDocInfo] = useState(null)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WEN', 'THU', 'FRI', 'SAT']
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const navigate = useNavigate()

  const fetchDocinfo = () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }

  const getAvailableSlot = async () => {
    setDocSlots([])

    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day + "-" + month + "-" + year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if(isSlotAvailable){
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime
          })
        }


        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }


  const bookAppoinment = async() => {
    
    if(!token){
      toast.warn('login to book!')
      return navigate('/login')
    }

    try {
      const date = docSlots[slotIndex][0].dateTime
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + "-" + month + "-" + year

      const {data} = await axios.post('https://serenocare-backend.onrender.com/api/user/book-appointment', {docId, slotDate , slotTime}, {headers: {token}})

      if(data.success){
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointment')
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  useEffect(() => {
    fetchDocinfo()
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlot()
  }, [docInfo])

  useEffect(() => {
    console.log(docSlots)
  }, [docSlots])

 return docInfo && (
  <div className='max-w-6xl mx-auto px-4 py-6'>

    {/* Doctor Info */}
    <div className='flex flex-col sm:flex-row gap-6'>

      <div>
        <img className='w-full sm:w-72 h-auto rounded-lg shadow-md object-cover' src={docInfo.image} alt={docInfo.name} />
      </div>

      <div className='flex-1 border border-gray-200 rounded-lg p-6 bg-white shadow-md'>

        <div className='flex items-center gap-2 text-2xl font-semibold text-gray-900 mb-1'>{docInfo.name} 
          <img className='w-5 h-5' src={assets.verified_icon} alt="Verified" />
          </div>

        <div className='flex items-center gap-3 text-sm text-gray-600 mb-3'>
          <p>{docInfo.degree} - {docInfo.speciality}</p> <span className='py-1 px-3 text-xs bg-gray-100 border rounded-full'>{docInfo.experience} yrs</span>
          </div>

        <div className='mb-4'>
          <p className='flex items-center gap-2 text-base font-medium text-gray-700 mb-1'>About <img className='w-4 h-4' src={assets.info_icon} alt="Info" /></p>
          <p className='text-sm text-gray-500 leading-relaxed'>{docInfo.about}</p>
        </div>

        <p className='text-base text-gray-700'>Appointment Fee: <span className='text-gray-900 font-semibold ml-1'>{ruppesSymbol}{docInfo.fees}</span></p>
      </div>

    </div>

    {/* Booking Slots */}
    <div className='mt-10'>

      <h2 className='text-xl font-semibold text-gray-800 mb-4'>Select Booking Slot</h2>

      <div className='flex gap-4 overflow-x-auto pb-2'>
        {docSlots.length > 0 && docSlots.map((item, index) => (
          <div onClick={() => setSlotIndex(index)} className={`flex flex-col items-center justify-center px-4 py-3 min-w-20 border rounded-lg cursor-pointer transition-all ${slotIndex === index ? 'bg-red-700 text-white border-red-700' : 'bg-white text-gray-700 border-gray-300'}`} key={index}>
            <p className='text-sm font-medium'>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
            <p className='text-lg font-semibold mt-1'>{item[0] && item[0].dateTime.getDate()}</p>
          </div>
        ))}
      </div>

      <div className='flex gap-3 overflow-x-auto mt-6 pb-2'>
        {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
          <button key={index} onClick={() => setSlotTime(item.time)} className={`text-sm px-5 py-2 rounded-full whitespace-nowrap border transition-all ${slotTime === item.time ? 'bg-red-700 text-white border-red-700' : 'text-gray-600 border-gray-300 hover:bg-gray-100'}`}>{item.time}</button>
        ))}
      </div>

      <div className='mt-8'>
        <button onClick={bookAppoinment} className='w-full sm:w-auto px-6 py-3 bg-red-700 text-white font-semibold rounded-lg shadow hover:bg-red-800 transition' disabled={!slotTime}>{slotTime ? 'Book Appointment' : 'Select a Slot to Book'}</button>
      </div>

    </div>

    {/* ----------------- Related Doctors -------------------*/}

    <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    
  </div>
)


}

export default Appointment
