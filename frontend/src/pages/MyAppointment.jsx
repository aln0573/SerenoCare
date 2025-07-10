import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyAppointment = () => {
  const { token , getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate()

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getUsersAppointments = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/user/appointments',{headers: {token}});

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointments = async (appointmentId) => {
    try {
      const { data } = await axios.post('http://localhost:4000/api/user/cancel-appointment',{appointmentId},{headers: {token}});
      if (data.success) {
        toast.success(data.message);
        getUsersAppointments();
        getDoctorsData()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      reciept: order.reciept,
      handler: async (response) => {

        try {
          
          const {data} = await axios.post('http://localhost:4000/api/user/verifyRazorpay', response , {headers: {token}})

          if(data.success){
            getUsersAppointments()
            navigate('/my-appointment')
          }

        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }

      },
      theme: {
        color: "#FFD700"
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const appointmentRazorpay = async (appointmentId) => {
    try {

      const {data} = await axios.post('http://localhost:4000/api/user/payment-razorpay', {appointmentId}, {headers: {token}})

      if(data.success){
        initPay(data.order)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUsersAppointments();
    }
  }, [token]);

  return (
    <div className='min-h-[80vh] px-6 md:px-20 py-10 text-gray-800'>
      <h2 className='text-3xl font-semibold mb-8'>My Appointments</h2>
      <div className='space-y-6'>
        {appointments.map((item, index) => (
          <div key={index} className='flex flex-col sm:flex-row border border-gray-200 rounded-xl shadow-sm p-5 gap-6 hover:shadow-md transition-shadow'>
            <div className='flex-shrink-0'>
              <img src={item.docData.image} alt={item.docData.name} className='w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg bg-gray-100' />
            </div>

            <div className='flex-1 space-y-2'>
              <p className='text-xl font-semibold'>{item.docData.name}</p>
              <p className='text-sm text-gray-600 mb-2'>{item.docData.speciality}</p>

              <div>
                <p className='text-sm text-gray-500'>Address:</p>
                <p className='text-sm text-gray-700'>{item.docData.address.line1}</p>
                <p className='text-sm text-gray-700'>{item.docData.address.line2}</p>
              </div>

              <p className='text-sm text-gray-500'>
                <span className='font-medium text-gray-700'>Date & Time:</span>{' '}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>

              {item.cancelled && (<p className="text-sm text-red-500 font-semibold">Appointment Cancelled</p>)}
              {!item.cancelled && item.payment && !item.isCompleted && (<p className="text-sm text-green-500 font-semibold">Paid</p>)}
              {item.isCompleted && (<p className='text-green-600'>Completed</p>)}
            </div>

            {!(item.cancelled || item.payment) && (
              <div className='flex flex-col gap-3 justify-center'>
                <button onClick={() => appointmentRazorpay(item._id)} className='px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition'>Pay Online</button>
                <button onClick={() => cancelAppointments(item._id)} className='px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition'>Cancel Appointment</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointment;
